import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BlockchainProposalStatus } from '../../blockchain/dto/blockchain-proposal.dto'
import { BlockchainAccountInfo } from '../../blockchain/dto/blockchain-account-info.dto'
import { BlockchainProposalWithDomainDetails } from '../proposals.service'
import { BlockchainProposalMotion } from '../../blockchain/dto/blockchain-proposal-motion.dto'

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
}

export class ProposalDto {
    @ApiProperty({
        description: 'Blockchain proposal index',
    })
    proposalIndex: number

    @ApiProperty({ description: 'Proposer account information', type: BlockchainAccountInfo })
    proposer: BlockchainAccountInfo

    @ApiProperty({ description: 'Beneficiary account information', type: BlockchainAccountInfo })
    beneficiary: BlockchainAccountInfo

    @ApiProperty({
        description: 'Value of the proposal',
    })
    value: number

    @ApiProperty({
        description: 'Locked deposit',
    })
    bond: number

    @ApiProperty({
        description: 'Status of a proposal',
        enum: ProposalStatus,
    })
    status: ProposalStatus

    @ApiPropertyOptional({
        description: 'Title of a corresponding idea or subject of a corresponding idea milestone',
    })
    title?: string

    @ApiProperty({
        description: 'Flag that indicates that proposal was created from idea',
    })
    isCreatedFromIdea: boolean

    @ApiProperty({
        description: 'Flag that indicates that proposal was created from idea milestone',
    })
    isCreatedFromIdeaMilestone: boolean

    @ApiProperty({
        description: 'Motions submitted to approve or reject this proposal',
        type: [BlockchainProposalMotion],
    })
    motions: BlockchainProposalMotion[]

    @ApiPropertyOptional({ description: 'Id of a corresponding idea' })
    ideaId?: string

    @ApiPropertyOptional({
        description: 'Id of a corresponding idea milestone',
    })
    ideaMilestoneId?: string

    @ApiPropertyOptional({ description: 'Id of an owner who created the idea' })
    ownerId?: string

    constructor({
        proposalIndex,
        proposer,
        beneficiary,
        value,
        bond,
        motions,
        status,
        title,
        isCreatedFromIdea,
        isCreatedFromIdeaMilestone,
        ideaId,
        ideaMilestoneId,
        ownerId,
    }: BlockchainProposalWithDomainDetails) {
        this.proposalIndex = proposalIndex
        this.proposer = proposer
        this.beneficiary = beneficiary
        this.value = value
        this.bond = bond
        this.motions = motions

        switch (status) {
            case BlockchainProposalStatus.Proposal:
                this.status = ProposalStatus.Submitted
                break
            case BlockchainProposalStatus.Approval:
                this.status = ProposalStatus.Approved
                break
        }

        this.title = title
        this.isCreatedFromIdea = isCreatedFromIdea
        this.isCreatedFromIdeaMilestone = isCreatedFromIdeaMilestone
        this.ideaId = ideaId
        this.ideaMilestoneId = ideaMilestoneId
        this.ownerId = ownerId
    }
}
