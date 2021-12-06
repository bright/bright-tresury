import { AccountInfo, Nil } from '../../util/types'
import { Time } from '@polkadot/util/types'

export interface MotionDto {
    hash: string
    method: ProposalMotionMethod | BountyMotionMethod
    ayes: Nil<AccountInfo[]>
    nays: Nil<AccountInfo[]>
    motionIndex: Nil<number>
    threshold: Nil<number>
    motionEnd: Nil<MotionEnd>
}

export interface MotionEnd {
    endBlock: number
    remainingBlocks: number
    timeLeft: Time
}

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
