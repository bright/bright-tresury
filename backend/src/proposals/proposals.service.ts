import {Injectable, NotFoundException} from '@nestjs/common';
import {BlockchainService} from "../blockchain/blockchain.service";
import { BlockchainProposal, ExtendedBlockchainProposal } from '../blockchain/dto/blockchainProposal.dto'
import {Idea} from '../ideas/entities/idea.entity';
import {IdeasService} from "../ideas/ideas.service";
import {getLogger} from "../logging.module";
import { IdeaMilestonesService } from '../ideas/ideaMilestones/idea.milestones.service'

const logger = getLogger()

@Injectable()
export class ProposalsService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly ideasService: IdeasService,
        private readonly ideaMilestoneService: IdeaMilestonesService
    ) {
    }

    async find(networkName: string): Promise<ExtendedBlockchainProposal[]> {
        try {

            const blockchainProposals = await this.blockchainService.getProposals()

            if (blockchainProposals.length === 0) {
                return []
            }

            const blockchainProposalsId = blockchainProposals.map(({ proposalIndex }: BlockchainProposal) => proposalIndex)

            const ideas = await this.ideasService.findByProposalIds(blockchainProposalsId, networkName)

            const ideaMilestones = await this.ideaMilestoneService.findByProposalIds(blockchainProposalsId, networkName)

            return blockchainProposals.map((blockchainProposal: BlockchainProposal) => {
                return {
                    ...blockchainProposal,
                    idea: ideas.get(blockchainProposal.proposalIndex),
                    ideaMilestone: ideaMilestones.get(blockchainProposal.proposalIndex)
                }
            })

        } catch (err) {
            logger.error(err)
            return []
        }
    }

    // async findOne(proposalId: number, networkName: string): Promise<[proposal: BlockchainProposal, idea: Idea | undefined]> {
    //
    //     // TODO: consider creating a separate function for getting one proposal.
    //     //  Maybe there will show up a function in polkadotApi.derive.treasury to get a single proposal.
    //     const blockchainProposals = await this.blockchainService.getProposals()
    //
    //     const proposal = blockchainProposals.find(({proposalIndex}) => proposalIndex === proposalId)
    //     if (!proposal) {
    //         throw new NotFoundException('Proposal not found.')
    //     }
    //
    //     const ideas = await this.ideasService.findByProposalIds([proposal.proposalIndex], networkName)
    //     return [proposal, ideas.get(proposal.proposalIndex)]
    // }

}
