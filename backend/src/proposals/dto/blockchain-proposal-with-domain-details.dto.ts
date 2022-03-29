import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { BlockchainProposal, BlockchainProposalStatus } from '../../blockchain/dto/blockchain-proposal.dto'
import { UserEntity } from '../../users/entities/user.entity'
import { Nil } from '../../utils/types'
import { ProposalEntity } from '../entities/proposal.entity'
import { PolkassemblyTreasuryProposalPostDto } from '../../polkassembly/treasury-proposals/treasury-proposal-post.dto'
import { PublicUserDto } from '../../users/dto/public-user.dto'

interface IBlockchainProposalWithDomainDetails {
    blockchain: BlockchainProposal
    entity: Nil<ProposalEntity>
    polkassembly?: Nil<PolkassemblyTreasuryProposalPostDto>
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId: Nil<string>
    ideaMilestoneId: Nil<string>
    proposer: PublicUserDto
    beneficiary: PublicUserDto
}

export class BlockchainProposalWithDomainDetails implements IBlockchainProposalWithDomainDetails {
    blockchain: BlockchainProposal
    entity: Nil<ProposalEntity>
    polkassembly: Nil<PolkassemblyTreasuryProposalPostDto>
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId: Nil<string>
    ideaMilestoneId: Nil<string>
    proposer: PublicUserDto
    beneficiary: PublicUserDto

    constructor({
        blockchain,
        entity,
        polkassembly,
        isCreatedFromIdea,
        isCreatedFromIdeaMilestone,
        ideaId,
        ideaMilestoneId,
        proposer,
        beneficiary,
    }: IBlockchainProposalWithDomainDetails) {
        this.blockchain = blockchain
        this.entity = entity
        this.polkassembly = polkassembly
        this.isCreatedFromIdea = isCreatedFromIdea
        this.isCreatedFromIdeaMilestone = isCreatedFromIdeaMilestone
        this.ideaId = ideaId
        this.ideaMilestoneId = ideaMilestoneId
        this.proposer = proposer
        this.beneficiary = beneficiary
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
