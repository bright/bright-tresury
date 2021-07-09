import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, In, Not, Repository } from 'typeorm'
import { SessionData } from '../auth/session/session.decorator'
import { IdeaProposalDetailsService } from '../idea-proposal-details/idea-proposal-details.service'
import { getLogger } from '../logging.module'
import { CreateIdeaDto } from './dto/create-idea.dto'
import { CreateIdeaNetworkDto } from './dto/create-idea-network.dto'
import { UpdateIdeaDto } from './dto/update-idea.dto'
import { Idea } from './entities/idea.entity'
import { IdeaNetwork } from './entities/idea-network.entity'
import { DefaultIdeaStatus, IdeaStatus } from './idea-status'

const logger = getLogger()

@Injectable()
export class IdeasService {
    constructor(
        @InjectRepository(Idea)
        private readonly ideaRepository: Repository<Idea>,
        @InjectRepository(IdeaNetwork)
        private readonly ideaNetworkRepository: Repository<IdeaNetwork>,
        private readonly detailsService: IdeaProposalDetailsService,
    ) {}

    async find(networkName?: string, sessionData?: SessionData): Promise<Idea[]> {
        try {
            return networkName
                ? await this.ideaRepository
                      .createQueryBuilder('idea')
                      .leftJoinAndSelect('idea.networks', 'network')
                      .where('network.name = :networkName', { networkName })
                      .andWhere(
                          new Brackets((qb) => {
                              qb.where('idea.status != :draftStatus', {
                                  draftStatus: IdeaStatus.Draft,
                              }).orWhere('idea.ownerId = :ownerId', { ownerId: sessionData?.user.id })
                          }),
                      )
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
        const idea = await this.ideaRepository.findOne(id, { relations: ['networks'] })
        if (!idea) {
            throw new NotFoundException('There is no idea with such id')
        }
        idea.canGetOrThrow(sessionData?.user)
        return idea
    }

    async findOneByNetworkId(networkId: string, sessionData: SessionData): Promise<Idea> {
        const ideaNetwork = await this.ideaNetworkRepository.findOne(networkId, { relations: ['idea'] })
        if (!ideaNetwork) {
            throw new NotFoundException(`There is no idea network with id ${networkId}`)
        }
        if (!ideaNetwork.idea) {
            throw new NotFoundException(`There is no idea for network with id: ${networkId}`)
        }
        ideaNetwork.idea.canGetOrThrow(sessionData.user)
        return ideaNetwork.idea
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

    async update(updateIdea: UpdateIdeaDto, id: string, sessionData: SessionData): Promise<Idea> {
        const currentIdea = await this.findOne(id, sessionData)

        currentIdea.canEditOrThrow(sessionData.user)

        // await this.ideaRepository.save({
        //     ...currentIdea,
        //     ...updateIdea,
        //     networks: updateIdea.networks
        //         ? updateIdea.networks.map((updatedNetwork: CreateIdeaNetworkDto) => {
        //               const existingNetwork = currentIdea.networks.find(
        //                   (currentIdeaNetwork: IdeaNetworkDto) => currentIdeaNetwork.id === updatedNetwork.id,
        //               )
        //               return {
        //                   ...existingNetwork,
        //                   ...updatedNetwork,
        //               }
        //           })
        //         : currentIdea.networks,
        //     links: updateIdea.links ? JSON.stringify(updateIdea.links) : currentIdea.links,
        // })
        return (await this.ideaRepository.findOne(id, { relations: ['networks'] }))!
    }

    async create(createIdeaDto: CreateIdeaDto, sessionData: SessionData): Promise<Idea> {
        const details = await this.detailsService.create(createIdeaDto.details)
        const idea = new Idea(
            createIdeaDto.networks.map((network: CreateIdeaNetworkDto) => new IdeaNetwork(network.name, network.value)),
            createIdeaDto.status ?? DefaultIdeaStatus,
            sessionData.user,
            details,
            createIdeaDto.beneficiary,
        )
        const createdIdea = await this.ideaRepository.save(idea)
        return (await this.ideaRepository.findOne(createdIdea.id, { relations: ['networks'] }))!
    }

    async delete(id: string, sessionData: SessionData) {
        const currentIdea = await this.findOne(id, sessionData)
        currentIdea.canEditOrThrow(sessionData.user)

        await this.ideaRepository.remove(currentIdea)
    }
}
