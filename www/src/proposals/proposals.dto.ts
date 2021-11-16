import { Time } from '@polkadot/util/types'
import { IdeaProposalDetailsDto } from '../idea-proposal-details/idea-proposal-details.dto'
import { AccountInfo, NetworkPlanckValue, Nil } from '../util/types'

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
    Closed = 'closed',
}
export interface PolkassemblyProposalDto {
    proposalIndex: number
    title: string
    content: string
}
export interface ProposalDto {
    proposalIndex: number
    proposer: AccountInfo
    beneficiary: AccountInfo
    value: NetworkPlanckValue
    bond: NetworkPlanckValue
    status: ProposalStatus
    motions: ProposalMotion[]
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId?: string
    ideaMilestoneId?: string
    ownerId?: string
    details?: IdeaProposalDetailsDto
    polkassembly?: PolkassemblyProposalDto
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

export enum ProposalMotionMethod {
    Approve = 'approveProposal',
    Reject = 'rejectProposal',
}
