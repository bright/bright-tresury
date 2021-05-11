import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {
    BlockchainProposalStatus,
    ExtendedBlockchainProposal,
} from '../../blockchain/dto/blockchainProposal.dto'

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded'
}

export class ProposalDto {

    @ApiProperty({
        description: 'Blockchain proposal index'
    })
    proposalIndex: number

    @ApiProperty({
        description: 'Proposer account address'
    })
    proposer: string

    @ApiProperty({
        description: 'Beneficiary account address'
    })
    beneficiary: string

    @ApiProperty({
        description: 'Value of the proposal'
    })
    value: number

    @ApiProperty({
        description: 'Locked deposit'
    })
    bond: number

    @ApiProperty({
        description: 'Status of a proposal',
        enum: ProposalStatus
    })
    status: ProposalStatus

    @ApiPropertyOptional({
        description: 'Title of a corresponding idea or subject of a corresponding idea milestone'
    })
    title?: string

    @ApiPropertyOptional({
        description: 'Id of a corresponding idea'
    })
    ideaId?: string

    @ApiPropertyOptional({
        description: 'Id of a corresponding idea milestone'
    })
    ideaMilestoneId?: string

    constructor(
        {
            proposalIndex,
            proposer,
            beneficiary,
            value,
            bond,
            status,
            idea,
            ideaMilestone
        }: ExtendedBlockchainProposal
    ) {
        this.proposalIndex = proposalIndex
        this.proposer = proposer
        this.beneficiary = beneficiary
        this.value = value
        this.bond = bond

        switch (status) {
            case BlockchainProposalStatus.Proposal:
                this.status = ProposalStatus.Submitted;
                break;
            case BlockchainProposalStatus.Approval:
                this.status = ProposalStatus.Approved;
                break;
        }

        this.title = idea?.title ?? ideaMilestone?.subject
        this.ideaId = idea?.id
        this.ideaMilestoneId = ideaMilestone?.id
    }
}
