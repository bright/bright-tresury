import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { SessionData } from '../../auth/session/session.decorator'
import { MilestoneDetailsService } from '../../milestone-details/milestone-details.service'
import { IdeasService } from '../ideas.service'
import { CreateIdeaMilestoneNetworkDto } from './dto/create-idea-milestone-network.dto'
import { CreateIdeaMilestoneDto } from './dto/create-idea-milestone.dto'
import { UpdateIdeaMilestoneDto } from './dto/update-idea-milestone.dto'
import { IdeaMilestoneNetwork } from './entities/idea-milestone-network.entity'
import { IdeaMilestone } from './entities/idea-milestone.entity'
import { IdeaMilestonesRepository } from './idea-milestones.repository'

@Injectable()
export class IdeaMilestonesService {
    constructor(
        @InjectRepository(IdeaMilestonesRepository)
        private readonly ideaMilestoneRepository: IdeaMilestonesRepository,
        @InjectRepository(IdeaMilestoneNetwork)
        private readonly ideaMilestoneNetworkRepository: Repository<IdeaMilestoneNetwork>,
        private readonly ideasService: IdeasService,
        private readonly detailsService: MilestoneDetailsService,
    ) {}

    async find(ideaId: string, sessionData: SessionData): Promise<IdeaMilestone[]> {
        const idea = await this.ideasService.findOne(ideaId, sessionData)
        return await this.ideaMilestoneRepository.find({ idea })
    }

    async findOne(ideaMilestoneId: string, sessionData?: SessionData): Promise<IdeaMilestone> {
        const ideaMilestone = await this.ideaMilestoneRepository.findOne(ideaMilestoneId, {
            relations: ['idea'],
        })
        if (!ideaMilestone) {
            throw new NotFoundException('Idea milestone with the given id not found')
        }
        ideaMilestone.idea.canGetOrThrow(sessionData?.user)
        return ideaMilestone
    }

    async findByProposalIds(proposalIds: number[], networkName: string): Promise<Map<number, IdeaMilestone>> {
        const result = new Map<number, IdeaMilestone>()

        const ideaMilestoneNetworks = await this.ideaMilestoneNetworkRepository.find({
            relations: ['ideaMilestone'],
            where: {
                blockchainProposalId: In(proposalIds),
                name: networkName,
            },
        })

        for (const { blockchainProposalId, ideaMilestone } of ideaMilestoneNetworks) {
            if (blockchainProposalId !== null && ideaMilestone) {
                result.set(blockchainProposalId, await this.findOne(ideaMilestone.id))
            }
        }

        return result
    }

    async create(ideaId: string, dto: CreateIdeaMilestoneDto, sessionData: SessionData): Promise<IdeaMilestone> {
        const idea = await this.ideasService.findOne(ideaId, sessionData)

        idea.canEditMilestonesOrThrow(sessionData.user)

        const details = await this.detailsService.create(dto.details)

        const milestone = await this.ideaMilestoneRepository.create({
            ...dto,
            idea,
            details,
            networks: dto.networks.map(
                ({ name, value }: CreateIdeaMilestoneNetworkDto) => new IdeaMilestoneNetwork(name, value),
            ),
        })
        const savedIdeaMilestone = await this.ideaMilestoneRepository.save(milestone)
        return (await this.ideaMilestoneRepository.findOne(savedIdeaMilestone.id))!
    }

    async update(
        ideaMilestoneId: string,
        dto: UpdateIdeaMilestoneDto,
        sessionData: SessionData,
    ): Promise<IdeaMilestone> {
        const currentIdeaMilestone = await this.ideaMilestoneRepository.findOne(ideaMilestoneId, {
            relations: ['idea'],
        })

        if (!currentIdeaMilestone) {
            throw new NotFoundException('Idea milestone with the given id not found')
        }

        currentIdeaMilestone.idea.canEditMilestonesOrThrow(sessionData.user)
        currentIdeaMilestone.canEditOrThrow()

        const updatedNetworks =
            dto.networks &&
            dto.networks.map((updatedNetwork: CreateIdeaMilestoneNetworkDto) => {
                const existingNetwork = currentIdeaMilestone.networks.find(
                    (currentIdeaMilestoneNetwork: IdeaMilestoneNetwork) =>
                        currentIdeaMilestoneNetwork.id === updatedNetwork.id,
                )

                if (existingNetwork) {
                    return { ...existingNetwork, ...updatedNetwork }
                }

                return this.ideaMilestoneNetworkRepository.create({
                    name: updatedNetwork.name,
                    value: updatedNetwork.value,
                })
            })

        const updatedDetails =
            dto.details && (await this.detailsService.update(dto.details, currentIdeaMilestone.details))

        await this.ideaMilestoneRepository.save({
            ...currentIdeaMilestone,
            ...dto,
            networks: updatedNetworks ?? currentIdeaMilestone.networks,
            details: updatedDetails ?? currentIdeaMilestone.details,
        })

        return (await this.ideaMilestoneRepository.findOne(currentIdeaMilestone!.id))!
    }

    async delete(ideaMilestoneId: string, sessionData: SessionData) {
        const currentIdeaMilestone = await this.findOne(ideaMilestoneId, sessionData)
        currentIdeaMilestone.idea.canEditMilestonesOrThrow(sessionData.user)

        await this.ideaMilestoneRepository.remove(currentIdeaMilestone)
        await this.detailsService.delete(currentIdeaMilestone.details)
    }
}
