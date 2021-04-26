import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {BlockchainProposal, BlockchainProposalStatus} from "../../blockchain/dto/blockchainProposal.dto";
import {Idea} from "../../ideas/entities/idea.entity";

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded'
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

    @ApiProperty({description: 'Status of a proposal', enum: ProposalStatus})
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

        switch (blockchainProposal.status) {
            case BlockchainProposalStatus.Proposal:
                this.status = ProposalStatus.Submitted;
                break;
            case BlockchainProposalStatus.Approval:
                this.status = ProposalStatus.Approved;
                break;
        }

        this.ideaId = idea?.id
        this.title = idea?.title
    }
}
