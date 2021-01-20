import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {BlockchainProposal} from "../../blockchain/dot/blockchainProposal.dto";
import {Idea} from "../../ideas/idea.entity";

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Closed = 'closed'
}

export class ProposalDto {
    @ApiProperty({description: 'Blockchain proposal index'})
    proposalIndex: number

    @ApiProperty({description: 'Proposer account address'})
    proposer: string

    @ApiProperty({description: 'Beneficiary account address'})
    beneficiary: string

    @ApiProperty({description: 'Value of the proposal'})
    value: number

    @ApiProperty({description: 'Locked deposit'})
    bond: number

    @ApiProperty({description: 'Status of a proposal', type: ProposalStatus})
    status: ProposalStatus

    @ApiPropertyOptional({description: 'Id of a corresponding idea'})
    ideaId?: string

    @ApiPropertyOptional({description: 'Title of a corresponding idea or idea milestone'})
    title?: string

    constructor(
        blockchainProposal: BlockchainProposal,
        idea?: Idea
    ) {
        this.proposalIndex = blockchainProposal.proposalIndex
        this.proposer = blockchainProposal.proposer
        this.beneficiary = blockchainProposal.beneficiary
        this.value = blockchainProposal.value
        this.bond = blockchainProposal.bond

        this.status = blockchainProposal.status === 'proposal' ? ProposalStatus.Submitted : ProposalStatus.Approved

        this.ideaId = idea?.id
        this.title = idea?.title
    }
}
