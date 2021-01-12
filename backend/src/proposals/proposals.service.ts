import {Injectable} from '@nestjs/common';
import {BlockchainService} from "../blockchain/blockchain.service";
import {IdeasService} from "../ideas/ideas.service";
import {getLogger} from "../logging.module";
import {ProposalDto, ProposalStatus} from "./dto/proposal.dto";

const logger = getLogger()

@Injectable()
export class ProposalsService {
    constructor(
        private readonly blockchainService: BlockchainService
        ) {
    }

    async find(networkName?: string): Promise<ProposalDto[]> {
        try {
            logger.info('proposals service find method')
            const blockchainProposals = await this.blockchainService.getProposals()
            logger.info(blockchainProposals)
            if (blockchainProposals.length === 0) {
                return []
            }

            return blockchainProposals.map((proposal) =>
                new ProposalDto(
                    proposal.proposalIndex,
                    proposal.proposer,
                    proposal.beneficiary,
                    proposal.value,
                    proposal.bond,
                    ProposalStatus.Submitted,
                    '',
                    '')
            )

        } catch (error) {
            logger.error(error)
            return []
        }
    }
}
