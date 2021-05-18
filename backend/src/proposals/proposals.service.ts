import { Injectable, NotFoundException } from '@nestjs/common'
import { BlockchainService } from '../blockchain/blockchain.service'
import { BlockchainProposal } from '../blockchain/dto/blockchainProposal.dto'
import { IdeasService } from '../ideas/ideas.service'
import { getLogger } from '../logging.module'
import { IdeaMilestonesService } from '../ideas/ideaMilestones/idea.milestones.service'

const logger = getLogger()

export type BlockchainProposalWithDomainDetails = BlockchainProposal & {
    title?: string
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId?: string
    ideaMilestoneId?: string
}

@Injectable()
export class ProposalsService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly ideasService: IdeasService,
        private readonly ideaMilestoneService: IdeaMilestonesService,
    ) {}

    async find(networkName: string): Promise<BlockchainProposalWithDomainDetails[]> {
        try {
            const proposals = await this.blockchainService.getProposals()

            if (proposals.length === 0) {
                return []
            }

            const indexes = proposals.map(({ proposalIndex }: BlockchainProposal) => proposalIndex)

            const ideas = await this.ideasService.findByProposalIds(indexes, networkName)
            const ideaMilestones = await this.ideaMilestoneService.findByProposalIds(indexes, networkName)

            return proposals.map((proposal: BlockchainProposal) => {
                const idea = ideas.get(proposal.proposalIndex)
                const ideaMilestone = ideaMilestones.get(proposal.proposalIndex)

                return {
                    ...proposal,
                    isCreatedFromIdea: idea !== undefined,
                    isCreatedFromIdeaMilestone: ideaMilestone !== undefined,
                    ideaId: idea?.id ?? ideaMilestone?.idea.id,
                    ideaMilestoneId: ideaMilestone?.id,
                    title: idea?.title ?? ideaMilestone?.subject,
                }
            })
        } catch (err) {
            logger.error(err)
            return []
        }
    }

    async findOne(proposalId: number, networkName: string): Promise<BlockchainProposalWithDomainDetails> {
        const proposals = await this.blockchainService.getProposals()

        const proposal = proposals.find(({ proposalIndex }: BlockchainProposal) => proposalIndex === proposalId)
        if (!proposal) {
            throw new NotFoundException('Proposal with the given id in the given network not found')
        }

        const ideas = await this.ideasService.findByProposalIds([proposal.proposalIndex], networkName)
        const ideaMilestones = await this.ideaMilestoneService.findByProposalIds([proposal.proposalIndex], networkName)

        const idea = ideas.get(proposal.proposalIndex)
        const ideaMilestone = ideaMilestones.get(proposal.proposalIndex)

        return {
            ...proposal,
            isCreatedFromIdea: idea !== undefined,
            isCreatedFromIdeaMilestone: ideaMilestone !== undefined,
            ideaId: idea?.id ?? ideaMilestone?.idea.id,
            ideaMilestoneId: ideaMilestone?.id,
            title: idea?.title ?? ideaMilestone?.subject,
        }
    }
}
