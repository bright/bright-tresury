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
import { Idea } from './entities/idea.entity'
import { IdeaNetwork } from './entities/idea-network.entity'
import { IdeaMilestoneNetwork } from './idea-milestones/entities/idea-milestone-network.entity'
import { IdeaMilestone } from './idea-milestones/entities/idea-milestone.entity'
import { IdeaMilestonesRepository } from './idea-milestones/idea-milestones.repository'
import { DefaultIdeaStatus, IdeaStatus } from './entities/idea-status'
import { NetworkPlanckValue } from '../utils/types'

const logger = getLogger()

@Injectable()
export class IdeasService {
    constructor(
        @InjectRepository(Idea)
        private readonly ideaRepository: Repository<Idea>,
        @InjectRepository(IdeaNetwork)
        private readonly ideaNetworkRepository: Repository<IdeaNetwork>,
        private readonly detailsService: IdeaProposalDetailsService,
        @InjectRepository(IdeaMilestonesRepository)
        private readonly ideaMilestoneRepository: IdeaMilestonesRepository,
    ) {}

    async find(networkName?: string, sessionData?: SessionData): Promise<Idea[]> {
        try {
            return networkName
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
                      .getMany()
                : await this.ideaRepository.find({
                      where: [{ status: Not(IdeaStatus.Draft) }, { ownerId: sessionData?.user.id }],
                  })
        } catch (error) {
            logger.error(error)
            return []
        }
    }

    async findOne(id: string, sessionData?: SessionData): Promise<Idea> {
        const idea = await this.ideaRepository.findOne(id)
        if (!idea) {
            throw new NotFoundException('There is no idea with such id')
        }
        idea.canGetOrThrow(sessionData?.user)
        return idea
    }

    async findByProposalIds(proposalIds: number[], networkName: string): Promise<Map<number, Idea>> {
        const result = new Map<number, Idea>()

        const ideaNetworks = await this.ideaNetworkRepository.find({
            relations: ['idea'],
            where: {
                blockchainProposalId: In(proposalIds),
                name: networkName,
            },
        })

        ideaNetworks.forEach(({ blockchainProposalId, idea }: IdeaNetwork) => {
            if (blockchainProposalId !== null && idea) {
                result.set(blockchainProposalId, idea)
            }
        })

        return result
    }

    async create(createIdeaDto: CreateIdeaDto, sessionData: SessionData): Promise<Idea> {
        const details = await this.detailsService.create(createIdeaDto.details)

        const idea = new Idea(
            createIdeaDto.networks.map((network: CreateIdeaNetworkDto) => new IdeaNetwork(network.name, network.value)),
            createIdeaDto.status ?? DefaultIdeaStatus,
            sessionData.user,
            details,
            [],
            createIdeaDto.beneficiary,
        )

        const createdIdea = await this.ideaRepository.save(idea)
        return (await this.ideaRepository.findOne(createdIdea.id))!
    }

    async delete(id: string, sessionData: SessionData) {
        const currentIdea = await this.findOne(id, sessionData)
        currentIdea.canEditOrThrow(sessionData.user)
        await this.ideaRepository.remove(currentIdea)
        await this.detailsService.delete(currentIdea.details)
    }

    async update(dto: UpdateIdeaDto, id: string, sessionData: SessionData): Promise<Idea> {
        const currentIdea = await this.findOne(id, sessionData)

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

        return (await this.ideaRepository.findOne(id))!
    }

    private getMilestoneNetworks(dtoNetworks: CreateIdeaNetworkDto[], milestone: IdeaMilestone) {
        return dtoNetworks.map((dtoNetwork) => {
            const milestoneNetwork = milestone.networks.find((n) => n.name === dtoNetwork.name)
            return milestoneNetwork ?? new IdeaMilestoneNetwork(dtoNetwork.name, '0' as NetworkPlanckValue)
        })
    }

    private getIdeaNetworks(dto: UpdateIdeaDto, currentIdea: Idea) {
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
                  return new IdeaNetwork(updatedNetwork.name, updatedNetwork.value)
              })
            : currentIdea.networks
    }
}
