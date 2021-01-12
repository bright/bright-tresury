import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

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
        proposalIndex: number,
        proposer: string,
        beneficiary: string,
        value: number,
        bond: number,
        status: ProposalStatus,
        ideaId?: string,
        title?: string,
    ) {
        this.proposalIndex = proposalIndex
        this.proposer = proposer
        this.beneficiary = beneficiary
        this.value = value
        this.bond = bond
        this.status = status
        this.ideaId = ideaId
        this.title = title
    }

}
