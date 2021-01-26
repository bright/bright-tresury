import {Injectable, NotFoundException} from '@nestjs/common';
import {BlockchainService} from "../blockchain/blockchain.service";
import {BlockchainProposal} from "../blockchain/dto/blockchainProposal.dto";
import {Idea} from '../ideas/idea.entity';
import {IdeasService} from "../ideas/ideas.service";
import {getLogger} from "../logging.module";

const logger = getLogger()

@Injectable()
export class ProposalsService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly ideasService: IdeasService
    ) {
    }

    async find(networkName: string): Promise<Array<[proposal: BlockchainProposal, idea: Idea | undefined]>> {
        try {
            const blockchainProposals = await this.blockchainService.getProposals()

            if (blockchainProposals.length === 0) {
                return []
            }

            const blockchainProposalsId = blockchainProposals.map(({proposalIndex}) => proposalIndex)
            const ideas = await this.ideasService.findByProposalIds(blockchainProposalsId, networkName)

            return blockchainProposals.map((proposal) =>
                [proposal, ideas.get(proposal.proposalIndex)]
            )

        } catch (error) {
            logger.error(error)
            return []
        }
    }

    async findOne(proposalId: number, networkName: string): Promise<[proposal: BlockchainProposal, idea: Idea | undefined]> {
        const blockchainProposals = await this.blockchainService.getProposals()

        const proposal = blockchainProposals.find(({proposalIndex}) => proposalIndex === proposalId)
        if (!proposal) {
            throw new NotFoundException('Proposal not found.')
        }

        const ideas = await this.ideasService.findByProposalIds([proposal.proposalIndex], networkName)
        return [proposal, ideas.get(proposal.proposalIndex)]
    }

}
