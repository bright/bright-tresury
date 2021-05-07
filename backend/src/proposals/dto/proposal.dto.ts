import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BlockchainProposalStatus } from '../../blockchain/dto/blockchainProposal.dto'
import { BlockchainProposalWithDomainDetails } from '../proposals.service'

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

    @ApiProperty({
        description: 'Proposer account address',
    })
    proposer: string

    @ApiProperty({
        description: 'Beneficiary account address',
    })
    beneficiary: string

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

    // TODO: Fill with proper description
    @ApiProperty({description: 'Voting info'})
    council: any[]

    @ApiPropertyOptional({description: 'Id of a corresponding idea'})
    ideaId?: string

    @ApiPropertyOptional({
        description: 'Id of a corresponding idea milestone',
    })
    ideaMilestoneId?: string

    constructor({
        proposalIndex,
        proposer,
        beneficiary,
        value,
        bond,
        council,
        status,
        title,
        isCreatedFromIdea,
        isCreatedFromIdeaMilestone,
        ideaId,
        ideaMilestoneId,
    }: BlockchainProposalWithDomainDetails) {
        this.proposalIndex = proposalIndex
        this.proposer = proposer
        this.beneficiary = beneficiary
        this.value = value
        this.bond = bond
        this.council = council

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
    }
}
