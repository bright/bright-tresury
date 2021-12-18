import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Nil } from '../../utils/types'
import { MotionTimeDto } from './motion-time.dto'

export type MotionMethod = ProposalMotionMethod | BountyMotionMethod

export enum ProposalMotionMethod {
    Approve = 'approveProposal',
    Reject = 'rejectProposal',
}

export enum BountyMotionMethod {
    ApproveBounty = 'approveBounty',
    CloseBounty = 'closeBounty',
    ProposeCurator = 'proposeCurator',
    RejectCurator = 'rejectCurator',
}

export enum MotionStatus {
    Proposed = 'Proposed',
    Approved = 'Approved',
    Disapproved = 'Disapproved',
}

export class MotionDto {
    @ApiProperty({ description: 'Hash of the motion' })
    hash!: string

    @ApiProperty({ description: 'Method of the motion' })
    method!: MotionMethod

    @ApiPropertyOptional({ description: 'Index of the motion', type: Number })
    motionIndex: Nil<number>

    @ApiPropertyOptional({
        description: 'Threshold after which the motion will be either approve or rejected',
        type: Number,
    })
    threshold: Nil<number>

    @ApiPropertyOptional({ description: 'Motion end information', type: MotionTimeDto })
    motionEnd?: Nil<MotionTimeDto>

    @ApiPropertyOptional({ description: 'Motion start information', type: MotionTimeDto })
    motionStart?: Nil<MotionTimeDto>
}
