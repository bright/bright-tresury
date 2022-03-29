import { Nil } from '../../util/types'
import { Time } from '@polkadot/util/types'
import { PublicUserDto } from '../../util/publicUser.dto'

interface ProposedMotionDto {
    status: MotionStatus.Proposed
    ayes: PublicUserDto[]
    nays: PublicUserDto[]
}

interface ExecutedMotionDto {
    status: MotionStatus.Approved | MotionStatus.Disapproved
}

interface BaseMotionDto {
    hash: string
    method: MotionMethod
    motionIndex: Nil<number>
    threshold: Nil<number>
    motionStart: Nil<MotionTimeDto>
    motionEnd: Nil<MotionTimeDto>
}

export type MotionDto = BaseMotionDto & (ProposedMotionDto | ExecutedMotionDto)

export enum MotionStatus {
    Proposed = 'Proposed',
    Approved = 'Approved',
    Disapproved = 'Disapproved',
}

export interface MotionTimeDto {
    type: MotionTimeType
    blockNo: number
    blocksCount: number
    time: Time
}

export enum MotionTimeType {
    Future = 'future',
    Past = 'past',
}

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
