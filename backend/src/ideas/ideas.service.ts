import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, In, Not, Repository } from 'typeorm'
import { SessionData } from '../auth/session/session.decorator'
import { IdeaProposalDetailsService } from '../idea-proposal-details/idea-proposal-details.service'
import { getLogger } from '../logging.module'
import { CreateIdeaDto } from './dto/create-idea.dto'
import { CreateIdeaNetworkDto } from './dto/create-idea-network.dto'
import { IdeaNetworkDto } from './dto/idea-network.dto'
import { UpdateIdeaDto } from './dto/update-idea.dto'
import { IdeaEntity } from './entities/idea.entity'
import { IdeaNetworkEntity } from './entities/idea-network.entity'
import { IdeaMilestoneNetworkEntity } from './idea-milestones/entities/idea-milestone-network.entity'
import { IdeaMilestoneEntity } from './idea-milestones/entities/idea-milestone.entity'
import { IdeaMilestonesRepository } from './idea-milestones/idea-milestones.repository'
import { DefaultIdeaStatus, IdeaStatus } from './entities/idea-status'
import { NetworkPlanckValue } from '../utils/types'
import { UsersService } from '../users/users.service'
import FindIdeaDto from './dto/find-idea.dto'

const logger = getLogger()

@Injectable()
export class IdeasService {
    constructor(
        @InjectRepository(IdeaEntity)
        private readonly ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(IdeaNetworkEntity)
        private readonly ideaNetworkRepository: Repository<IdeaNetworkEntity>,
        private readonly detailsService: IdeaProposalDetailsService,
        @InjectRepository(IdeaMilestonesRepository)
        private readonly ideaMilestoneRepository: IdeaMilestonesRepository,
        private readonly usersService: UsersService,
    ) {}

    async find(networkName?: string, sessionData?: SessionData): Promise<FindIdeaDto[]> {
        try {
            const entities = networkName
                ? await this.ideaRepository
                      .createQueryBuilder('idea')
                      .leftJoinAndSelect('idea.networks', 'networkToQuery')
                      .leftJoinAndSelect('idea.details', 'details')
                      .where('networkToQuery.name = :networkName', { networkName })
                      .andWhere(
                          new Brackets((qb) => {
                              qb.where('idea.status != :draftStatus', {
                                  draftStatus: IdeaStatus.Draft,
                              }).orWhere('idea.ownerId = :ownerId', { ownerId: sessionData?.user.id })
                          }),
                      )
                      .leftJoinAndSelect('idea.networks', 'network')
                      .leftJoinAndSelect('idea.owner', 'owner')
                      .leftJoinAndSelect('owner.web3Addresses', 'web3Addresses')
                      .getMany()
                : await this.ideaRepository.find({
                      where: [{ status: Not(IdeaStatus.Draft) }, { ownerId: sessionData?.user.id }],
                      relations: ['owner', 'owner.web3Addresses'],
                  })
            return await Promise.all(entities.map((entity) => this.createFindIdeaDto(entity)))
        } catch (error) {
            logger.error(error)
            return []
        }
    }

    async findOne(id: string, sessionData?: SessionData): Promise<FindIdeaDto> {
        const idea = await this.ideaRepository.findOne(id, {
            relations: ['owner', 'owner.web3Addresses'],
        })
        if (!idea) {
            throw new NotFoundException('There is no idea with such id')
        }
        idea.canGetOrThrow(sessionData?.user)
        return this.createFindIdeaDto(idea)
    }

    async createFindIdeaDto(entity: IdeaEntity): Promise<FindIdeaDto> {
        if (!entity.beneficiary) return { entity }
        return {
            entity,
            beneficiary: await this.usersService.getPublicUserDataForWeb3Address(entity.beneficiary),
        }
    }

    async findByProposalIds(proposalIds: number[], networkName: string): Promise<Map<number, IdeaEntity>> {
        const result = new Map<number, IdeaEntity>()

        const ideaNetworks = await this.ideaNetworkRepository.find({
            relations: ['idea'],
            where: {
                blockchainProposalId: In(proposalIds),
                name: networkName,
            },
        })

        ideaNetworks.forEach(({ blockchainProposalId, idea }: IdeaNetworkEntity) => {
            if (blockchainProposalId !== null && idea) {
                result.set(blockchainProposalId, idea)
            }
        })

        return result
    }

    async create(createIdeaDto: CreateIdeaDto, sessionData: SessionData): Promise<FindIdeaDto> {
        const details = await this.detailsService.create(createIdeaDto.details)

        const idea = new IdeaEntity(
            createIdeaDto.networks.map(
                (network: CreateIdeaNetworkDto) => new IdeaNetworkEntity(network.name, network.value),
            ),
            createIdeaDto.status ?? DefaultIdeaStatus,
            sessionData.user,
            details,
            createIdeaDto.beneficiary,
        )

        const createdIdea = await this.ideaRepository.save(idea)
        return (await this.findOne(createdIdea.id, sessionData))!
    }

    async delete(id: string, sessionData: SessionData) {
        const { entity: currentIdea } = await this.findOne(id, sessionData)
        currentIdea.canEditOrThrow(sessionData.user)
        await this.ideaRepository.remove(currentIdea)
        await this.detailsService.delete(currentIdea.details)
    }

    async update(dto: UpdateIdeaDto, id: string, sessionData: SessionData): Promise<FindIdeaDto> {
        const { entity: currentIdea } = await this.findOne(id, sessionData)

        currentIdea.canEditOrThrow(sessionData.user)

        if (dto.details) {
            await this.detailsService.update(dto.details, currentIdea.details)
        }

        await this.ideaRepository.save({
            ...currentIdea,
            beneficiary: dto.beneficiary ?? currentIdea.beneficiary,
            status: dto.status ?? currentIdea.status,
            networks: this.getIdeaNetworks(dto, currentIdea),
        })

        const milestones = await this.ideaMilestoneRepository.find({ ideaId: currentIdea.id })

        if (dto.networks) {
            await Promise.all(
                milestones.map((milestone) => {
                    const networks = this.getMilestoneNetworks(dto.networks!, milestone)
                    return this.ideaMilestoneRepository.save({ id: milestone.id, networks })
                }),
            )
        }

        return (await this.findOne(id, sessionData))!
    }

    private getMilestoneNetworks(dtoNetworks: CreateIdeaNetworkDto[], milestone: IdeaMilestoneEntity) {
        return dtoNetworks.map((dtoNetwork) => {
            const milestoneNetwork = milestone.networks.find((n) => n.name === dtoNetwork.name)
            return milestoneNetwork ?? new IdeaMilestoneNetworkEntity(dtoNetwork.name, '0' as NetworkPlanckValue)
        })
    }

    private getIdeaNetworks(dto: UpdateIdeaDto, currentIdea: IdeaEntity) {
        return dto.networks
            ? dto.networks.map((updatedNetwork: CreateIdeaNetworkDto) => {
                  const existingNetwork = currentIdea.networks.find(
                      (currentIdeaNetwork: IdeaNetworkDto) => currentIdeaNetwork.id === updatedNetwork.id,
                  )
                  if (existingNetwork) {
                      return {
                          ...existingNetwork,
                          ...updatedNetwork,
                      }
                  }
                  return new IdeaNetworkEntity(updatedNetwork.name, updatedNetwork.value)
              })
            : currentIdea.networks
    }
}
