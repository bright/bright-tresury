import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { SessionData } from '../../auth/session/session.decorator'
import { BlockchainProposalStatus } from '../../blockchain/dto/blockchain-proposal.dto'
import { UpdateIdeaProposalDetailsDto } from '../../idea-proposal-details/dto/update-idea-proposal-details.dto'
import { IdeaProposalDetails } from '../../idea-proposal-details/idea-proposal-details.entity'
import { IdeaProposalDetailsService } from '../../idea-proposal-details/idea-proposal-details.service'
import { ProposalsService } from '../proposals.service'

@Injectable()
export class ProposalDetailsService {
    constructor(
        private readonly proposalsService: ProposalsService,
        private readonly ideaProposalDetailsService: IdeaProposalDetailsService,
    ) {}

    async update(
        proposalIndex: number,
        network: string,
        dto: UpdateIdeaProposalDetailsDto,
        { user }: SessionData,
    ): Promise<IdeaProposalDetails> {
        const proposal = await this.proposalsService.findOne(proposalIndex, network)

        if (!proposal.entity) {
            throw new NotFoundException('Details for a proposal with the given id in the given network not found')
        }

        if (!proposal.blockchain.isOwner(user) && !proposal.entity.isOwner(user)) {
            throw new ForbiddenException('The given user cannot edit this proposal')
        }

        if (proposal.blockchain.status === BlockchainProposalStatus.Approval) {
            throw new BadRequestException('You cannot edit an approved proposal details')
        }

        return this.ideaProposalDetailsService.update(dto, proposal.entity.details)
    }
}
