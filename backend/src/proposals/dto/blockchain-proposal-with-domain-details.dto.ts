import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { BlockchainProposal, BlockchainProposalStatus } from '../../blockchain/dto/blockchain-proposal.dto'
import { UserEntity } from '../../users/user.entity'
import { Nil } from '../../utils/types'
import { ProposalEntity } from '../entities/proposal.entity'
import { PolkassemblyTreasuryProposalPostDto } from '../../polkassembly/treasury-proposals/treasury-proposal-post.dto'

interface IBlockchainProposalWithDomainDetails {
    blockchain: BlockchainProposal
    entity: Nil<ProposalEntity>
    polkassembly?: Nil<PolkassemblyTreasuryProposalPostDto>
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId: Nil<string>
    ideaMilestoneId: Nil<string>
}

export class BlockchainProposalWithDomainDetails implements IBlockchainProposalWithDomainDetails {
    blockchain: BlockchainProposal
    entity: Nil<ProposalEntity>
    polkassembly: Nil<PolkassemblyTreasuryProposalPostDto>
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId: Nil<string>
    ideaMilestoneId: Nil<string>

    constructor({
        blockchain,
        entity,
        polkassembly,
        isCreatedFromIdea,
        isCreatedFromIdeaMilestone,
        ideaId,
        ideaMilestoneId,
    }: IBlockchainProposalWithDomainDetails) {
        this.blockchain = blockchain
        this.entity = entity
        this.polkassembly = polkassembly
        this.isCreatedFromIdea = isCreatedFromIdea
        this.isCreatedFromIdeaMilestone = isCreatedFromIdeaMilestone
        this.ideaId = ideaId
        this.ideaMilestoneId = ideaMilestoneId
    }

    isOwner = (user: UserEntity) => this.blockchain.isOwner(user) || this.entity?.isOwner(user)

    isOwnerOrThrow = (user: UserEntity) => {
        if (!this.isOwner(user)) {
            throw new ForbiddenException('The given user cannot edit this proposal')
        }
    }

    canEditOrThrow = (user: UserEntity) => {
        this.isOwnerOrThrow(user)
    }

    canEditMilestonesOrThrow = (user: UserEntity) => {
        if (!this.entity) {
            throw new BadRequestException('You cannot edit milestones of a proposal with no details created')
        }
        this.isOwnerOrThrow(user)
    }
    hasBlockchainProposalStatus = (status?: BlockchainProposalStatus) => this.blockchain.status === status
}
