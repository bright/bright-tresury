import { Time } from '@polkadot/util/types'
import { IdeaProposalDetailsDto } from '../idea-proposal-details/idea-proposal-details.dto'
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
    motions: ProposalMotion[]
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId?: string
    ideaMilestoneId?: string
    ownerId?: string
    details?: IdeaProposalDetailsDto
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
