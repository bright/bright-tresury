import {Injectable} from '@nestjs/common';
import {BlockchainService} from "../blockchain/blockchain.service";
import {IdeasService} from "../ideas/ideas.service";
import {getLogger} from "../logging.module";
import {ProposalDto} from "./dto/proposal.dto";

const logger = getLogger()

@Injectable()
export class ProposalsService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly ideasService: IdeasService
    ) {
    }

    async find(networkName: string): Promise<ProposalDto[]> {
        try {
            const blockchainProposals = await this.blockchainService.getProposals()

            if (blockchainProposals.length === 0) {
                return []
            }

            const blockchainProposalsId = blockchainProposals.map(({proposalIndex}) => proposalIndex)
            const ideas = await this.ideasService.findByProposalIds(blockchainProposalsId, networkName)

            return blockchainProposals.map((proposal) =>
                new ProposalDto(proposal, ideas.get(proposal.proposalIndex))
            )

        } catch (error) {
            logger.error(error)
            return []
        }
    }
}
