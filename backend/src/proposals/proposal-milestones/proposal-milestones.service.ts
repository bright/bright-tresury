import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SessionData } from '../../auth/session/session.decorator'
import { MilestoneDetailsService } from '../../milestone-details/milestone-details.service'
import { ProposalsService } from '../proposals.service'
import { CreateProposalMilestoneDto } from './dto/create-proposal-milestone.dto'
import { UpdateProposalMilestoneDto } from './dto/update-proposal-milestone.dto'
import { ProposalMilestone } from './entities/proposal-milestone.entity'

@Injectable()
export class ProposalMilestonesService {
    constructor(
        @InjectRepository(ProposalMilestone)
        private readonly proposalMilestoneRepository: Repository<ProposalMilestone>,
        private readonly proposalsService: ProposalsService,
        private readonly detailsService: MilestoneDetailsService,
    ) {}

    async find(proposalIndex: number, networkId: string): Promise<ProposalMilestone[]> {
        const proposal = await this.proposalsService.findOne(proposalIndex, networkId)

        if (!proposal.entity) {
            return []
        }

        return this.proposalMilestoneRepository.find({
            where: { proposalId: proposal.entity.id },
        })
    }

    async findOne(milestoneId: string, proposalIndex: number, networkId: string): Promise<ProposalMilestone> {
        const milestone = await this.proposalMilestoneRepository.findOne({
            where: {
                id: milestoneId,
                proposal: { blockchainProposalId: proposalIndex, networkId },
            },
            relations: ['proposal'],
        })

        if (!milestone) {
            throw new NotFoundException('Proposal milestone with a given id not found')
        }

        return milestone
    }

    async create(
        proposalIndex: number,
        networkId: string,
        dto: CreateProposalMilestoneDto,
        { user }: SessionData,
    ): Promise<ProposalMilestone> {
        const proposal = await this.proposalsService.findOne(proposalIndex, networkId)

        proposal.canEditMilestonesOrThrow(user)

        const details = await this.detailsService.create(dto.details)

        const milestone = this.proposalMilestoneRepository.create({
            details,
            proposalId: proposal.entity!.id,
        })
        const savedMilestone = await this.proposalMilestoneRepository.save(milestone)

        return (await this.proposalMilestoneRepository.findOne(savedMilestone.id))!
    }

    async update(
        milestoneId: string,
        proposalIndex: number,
        networkId: string,
        dto: UpdateProposalMilestoneDto,
        { user }: SessionData,
    ): Promise<ProposalMilestone> {
        const proposal = await this.proposalsService.findOne(proposalIndex, networkId)
        proposal.canEditMilestonesOrThrow(user)

        const milestone = await this.findOne(milestoneId, proposalIndex, networkId)
        if (!dto.details) {
            return milestone
        }

        await this.detailsService.update(dto.details, milestone.details)
        return (await this.proposalMilestoneRepository.findOne(milestone.id))!
    }

    async delete(milestoneId: string, proposalIndex: number, networkId: string, { user }: SessionData): Promise<void> {
        const proposal = await this.proposalsService.findOne(proposalIndex, networkId)

        proposal.canEditMilestonesOrThrow(user)

        const milestone = await this.findOne(milestoneId, proposalIndex, networkId)

        await this.detailsService.delete(milestone.details)
        await this.proposalMilestoneRepository.remove(milestone)
    }
}
