import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isBefore } from 'date-fns'
import { In, Repository } from 'typeorm'
import { SessionData } from '../../auth/session/session.decorator'
import { IdeasService } from '../ideas.service'
import { CreateIdeaMilestoneDto } from './dto/create-idea-milestone.dto'
import { IdeaMilestoneNetwork } from './entities/idea-milestone-network.entity'
import { UpdateIdeaMilestoneDto } from './dto/update-idea-milestone.dto'
import { IdeaMilestone } from './entities/idea-milestone.entity'
import { IdeaMilestoneStatus } from './idea-milestone-status'
import { CreateIdeaMilestoneNetworkDto } from './dto/create-idea-milestone-network.dto'

@Injectable()
export class IdeaMilestonesService {
    constructor(
        @InjectRepository(IdeaMilestone)
        private readonly ideaMilestoneRepository: Repository<IdeaMilestone>,
        @InjectRepository(IdeaMilestoneNetwork)
        private readonly ideaMilestoneNetworkRepository: Repository<IdeaMilestoneNetwork>,
        private readonly ideasService: IdeasService,
    ) {}

    async find(ideaId: string, sessionData: SessionData): Promise<IdeaMilestone[]> {
        const idea = await this.ideasService.findOne(ideaId, sessionData)
        if (!idea) {
            throw new NotFoundException('Idea with the given id not found')
        }
        return await this.ideaMilestoneRepository.find({
            where: { idea },
            relations: ['networks'],
        })
    }

    async findOne(ideaMilestoneId: string, sessionData?: SessionData): Promise<IdeaMilestone> {
        const ideaMilestone = await this.ideaMilestoneRepository.findOne(ideaMilestoneId, {
            relations: ['networks', 'idea'],
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

    async create(
        ideaId: string,
        { subject, beneficiary, dateFrom, dateTo, description, networks }: CreateIdeaMilestoneDto,
        sessionData: SessionData,
    ): Promise<IdeaMilestone> {
        const idea = await this.ideasService.findOne(ideaId, sessionData)

        idea.canEditOrThrow(sessionData.user)

        if (dateFrom && dateTo && isBefore(new Date(dateTo), new Date(dateFrom))) {
            throw new BadRequestException('End date of the milestone cannot be prior to the start date')
        }

        const savedIdeaMilestone = await this.ideaMilestoneRepository.save(
            new IdeaMilestone(
                idea,
                subject,
                IdeaMilestoneStatus.Active,
                networks.map(({ name, value }: CreateIdeaMilestoneNetworkDto) => new IdeaMilestoneNetwork(name, value)),
                beneficiary,
                dateFrom,
                dateTo,
                description,
            ),
        )
        return (await this.ideaMilestoneRepository.findOne(savedIdeaMilestone.id, { relations: ['networks'] }))!
    }

    async update(
        ideaMilestoneId: string,
        updateIdeaMilestoneDto: UpdateIdeaMilestoneDto,
        sessionData: SessionData,
    ): Promise<IdeaMilestone> {
        const currentIdeaMilestone = await this.ideaMilestoneRepository.findOne(ideaMilestoneId, {
            relations: ['networks', 'idea'],
        })

        if (!currentIdeaMilestone) {
            throw new NotFoundException('Idea milestone with the given id not found')
        }

        currentIdeaMilestone.idea.canEditOrThrow(sessionData.user)

        const dateFrom = updateIdeaMilestoneDto.dateFrom ?? currentIdeaMilestone.dateFrom
        const dateTo = updateIdeaMilestoneDto.dateTo ?? currentIdeaMilestone.dateTo

        if (dateFrom && dateTo && isBefore(new Date(dateTo), new Date(dateFrom))) {
            throw new BadRequestException('End date of the milestone cannot be prior to the start date')
        }

        const updatedNetworks =
            updateIdeaMilestoneDto.networks &&
            updateIdeaMilestoneDto.networks.map((updatedNetwork: CreateIdeaMilestoneNetworkDto) => {
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

        await this.ideaMilestoneRepository.save({
            ...currentIdeaMilestone,
            ...updateIdeaMilestoneDto,
            networks: updatedNetworks ?? currentIdeaMilestone.networks,
        })

        return (await this.ideaMilestoneRepository.findOne(currentIdeaMilestone.id, { relations: ['networks'] }))!
    }
}
