import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { BlockchainProposal } from '../../blockchain/dto/blockchain-proposal.dto'
import { User } from '../../users/user.entity'
import { Nil } from '../../utils/types'
import { Proposal } from '../entities/proposal.entity'

interface IBlockchainProposalWithDomainDetails {
    blockchain: BlockchainProposal
    entity: Nil<Proposal>
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId: Nil<string>
    ideaMilestoneId: Nil<string>
}

export class BlockchainProposalWithDomainDetails implements IBlockchainProposalWithDomainDetails {
    blockchain: BlockchainProposal
    entity: Nil<Proposal>
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId: Nil<string>
    ideaMilestoneId: Nil<string>

    constructor({
        blockchain,
        entity,
        isCreatedFromIdea,
        isCreatedFromIdeaMilestone,
        ideaId,
        ideaMilestoneId,
    }: IBlockchainProposalWithDomainDetails) {
        this.blockchain = blockchain
        this.entity = entity
        this.isCreatedFromIdea = isCreatedFromIdea
        this.isCreatedFromIdeaMilestone = isCreatedFromIdeaMilestone
        this.ideaId = ideaId
        this.ideaMilestoneId = ideaMilestoneId
    }

    isOwner = (user: User) => this.blockchain.isOwner(user) || this.entity?.isOwner(user)

    isOwnerOrThrow = (user: User) => {
        if (!this.isOwner(user)) {
            throw new ForbiddenException('The given user cannot edit this proposal')
        }
    }

    canEditOrThrow = (user: User) => {
        this.isOwnerOrThrow(user)
        this.blockchain.isEditableOrThrow()
    }

    canEditMilestonesOrThrow = (user: User) => {
        if (!this.entity) {
            throw new BadRequestException('You cannot edit milestones of a proposal with no details created')
        }
        this.isOwnerOrThrow(user)
        this.blockchain.isEditableOrThrow()
    }
}
