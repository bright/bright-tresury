import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProposalsService } from '../proposals.service'
import { ProposalMilestone } from './entities/proposal-milestone.entity'

@Injectable()
export class ProposalMilestonesService {
    constructor(
        @InjectRepository(ProposalMilestone)
        private readonly proposalMilestoneRepository: Repository<ProposalMilestone>,
        private readonly proposalsService: ProposalsService,
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

    async findOne(milestoneId: string, proposalIndex: number): Promise<ProposalMilestone> {
        const milestone = await this.proposalMilestoneRepository.findOne(milestoneId, { relations: ['proposal'] })

        if (!milestone) {
            throw new NotFoundException('Proposal milestone with a given id not found')
        }

        if (milestone.proposal.blockchainProposalId !== proposalIndex) {
            throw new NotFoundException('Proposal with a given id not found')
        }

        return milestone
    }
}
