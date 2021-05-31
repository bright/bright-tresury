import { Time } from '@polkadot/util/types'
import { Nil } from '../util/types'

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
    Closed = 'closed',
}

export interface ProposalDto {
    proposalIndex: number
    proposer: AccountInfo
    beneficiary: AccountInfo
    value: number
    bond: number
    status: ProposalStatus
    title?: string
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId?: string
    ideaMilestoneId?: string
    motions: ProposalMotion[]
}

export interface ProposalMotion {
    hash: string
    method: ProposalMotionMethod
    ayes: Nil<AccountInfo[]>
    nays: Nil<AccountInfo[]>
    motionIndex: Nil<number>
    threshold: Nil<number>
    motionEnd: Nil<ProposalMotionEnd>
}

export interface ProposalMotionEnd {
    endBlock: number
    remainingBlocks: number
    timeLeft: Time
}

export interface AccountInfo {
    address: string
    display?: string
    email?: string
    legal?: string
    riot?: string
    twitter?: string
    web?: string
}

export enum ProposalMotionMethod {
    Approve = 'approveProposal',
    Reject = 'rejectProposal',
}
