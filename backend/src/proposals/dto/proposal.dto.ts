import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BlockchainProposalStatus } from '../../blockchain/dto/blockchain-proposal.dto'
import { IdeaProposalDetailsDto } from '../../idea-proposal-details/dto/idea-proposal-details.dto'
import { Nil } from '../../utils/types'
import { ProposedMotionDto } from '../../blockchain/dto/proposed-motion.dto'
import { BlockchainProposalWithDomainDetails } from './blockchain-proposal-with-domain-details.dto'
import { NetworkPlanckValue } from '../../utils/types'
import { PolkassemblyTreasuryProposalPostDto } from '../../polkassembly/treasury-proposals/treasury-proposal-post.dto'
import { PublicUserDto } from '../../users/dto/public-user.dto'

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
    Unkown = 'unknown',
}

export class ProposalDto {
    @ApiProperty({
        description: 'Blockchain proposal index',
    })
    proposalIndex: number

    @ApiProperty({ description: 'Proposer account information', type: PublicUserDto })
    proposer: PublicUserDto

    @ApiProperty({ description: 'Beneficiary account information', type: PublicUserDto })
    beneficiary: PublicUserDto

    @ApiProperty({
        description: 'Value of the proposal',
    })
    value: NetworkPlanckValue

    @ApiProperty({
        description: 'Locked deposit',
    })
    bond: NetworkPlanckValue

    @ApiProperty({
        description: 'Status of a proposal',
        enum: ProposalStatus,
    })
    status: ProposalStatus

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
        type: [ProposedMotionDto],
    })
    motions: ProposedMotionDto[]

    @ApiPropertyOptional({ description: 'Id of a corresponding idea' })
    ideaId?: Nil<string>

    @ApiPropertyOptional({
        description: 'Id of a corresponding idea milestone',
    })
    ideaMilestoneId?: Nil<string>

    @ApiPropertyOptional({ description: 'Public data of an owner who created the idea' })
    owner?: Nil<PublicUserDto>

    @ApiPropertyOptional({
        description: 'Contextual details of the proposal',
        type: IdeaProposalDetailsDto,
    })
    details?: IdeaProposalDetailsDto

    @ApiPropertyOptional({
        description: 'Proposal data kept in polkassembly server',
        type: PolkassemblyTreasuryProposalPostDto,
    })
    polkassembly?: Nil<PolkassemblyTreasuryProposalPostDto>

    constructor({
        blockchain: { proposalIndex, value, bond, motions, status },
        entity,
        polkassembly,
        isCreatedFromIdea,
        isCreatedFromIdeaMilestone,
        ideaId,
        ideaMilestoneId,
        proposer,
        beneficiary,
    }: BlockchainProposalWithDomainDetails) {
        this.proposalIndex = proposalIndex
        this.polkassembly = polkassembly
        this.proposer = proposer
        this.beneficiary = beneficiary
        this.value = value
        this.bond = bond
        this.motions = motions

        this.status = ProposalDto.toProposalDtoStatus(status)
        this.details = entity ? new IdeaProposalDetailsDto(entity.details) : undefined
        this.isCreatedFromIdea = isCreatedFromIdea
        this.isCreatedFromIdeaMilestone = isCreatedFromIdeaMilestone
        this.ideaId = ideaId
        this.ideaMilestoneId = ideaMilestoneId
        this.owner = entity?.owner ? PublicUserDto.fromUserEntity(entity?.owner) : null
    }
    static toProposalDtoStatus = (status: BlockchainProposalStatus) => {
        switch (status) {
            case BlockchainProposalStatus.Proposal:
                return ProposalStatus.Submitted
            case BlockchainProposalStatus.Approval:
                return ProposalStatus.Approved
            case BlockchainProposalStatus.Unknown:
                return ProposalStatus.Unkown
        }
    }
    static fromProposalDtoStatus = (status: ProposalStatus) => {
        switch (status) {
            case ProposalStatus.Submitted:
                return BlockchainProposalStatus.Proposal
            case ProposalStatus.Approved:
                return BlockchainProposalStatus.Approval
            case ProposalStatus.Unkown:
                return BlockchainProposalStatus.Unknown
        }
    }
}
