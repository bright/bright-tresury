import { Injectable, NotFoundException } from '@nestjs/common'
import { BlockchainService } from '../blockchain/blockchain.service'
import { BlockchainProposal } from '../blockchain/dto/blockchainProposal.dto'
import { IdeasService } from '../ideas/ideas.service'
import { getLogger } from '../logging.module'
import { IdeaMilestonesService } from '../ideas/ideaMilestones/idea.milestones.service'
import { Idea } from '../ideas/entities/idea.entity'
import { IdeaMilestone } from '../ideas/ideaMilestones/entities/idea.milestone.entity'

const logger = getLogger()

export type BlockchainProposalWithOrigin = BlockchainProposal & {
    idea?: Idea
    ideaMilestone?: IdeaMilestone
}

@Injectable()
export class ProposalsService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly ideasService: IdeasService,
        private readonly ideaMilestoneService: IdeaMilestonesService,
    ) {}

    async find(networkName: string): Promise<BlockchainProposalWithOrigin[]> {
        try {
            const proposals = await this.blockchainService.getProposals()

            if (proposals.length === 0) {
                return []
            }

            const indexes = proposals.map(({ proposalIndex }: BlockchainProposal) => proposalIndex)

            const ideas = await this.ideasService.findByProposalIds(indexes, networkName)

            const ideaMilestones = await this.ideaMilestoneService.findByProposalIds(indexes, networkName)

            return proposals.map((proposal: BlockchainProposal) => {
                return {
                    ...proposal,
                    idea: ideas.get(proposal.proposalIndex),
                    ideaMilestone: ideaMilestones.get(proposal.proposalIndex),
                }
            })
        } catch (err) {
            logger.error(err)
            return []
        }
    }

    async findOne(proposalId: number, networkName: string): Promise<BlockchainProposalWithOrigin> {
        const proposals = await this.blockchainService.getProposals()

        const proposal = proposals.find(({ proposalIndex }: BlockchainProposal) => proposalIndex === proposalId)

        if (!proposal) {
            throw new NotFoundException('Proposal with the given id in the given network not found')
        }

        const ideas = await this.ideasService.findByProposalIds([proposal.proposalIndex], networkName)

        const ideaMilestones = await this.ideaMilestoneService.findByProposalIds([proposal.proposalIndex], networkName)

        return {
            ...proposal,
            idea: ideas.get(proposal.proposalIndex),
            ideaMilestone: ideaMilestones.get(proposal.proposalIndex),
        }
    }
}
