import {Time} from "@polkadot/util/types";

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
    council: ProposalMotion[]
}

export interface ProposalMotionEnd {
    endBlock?: number,
    remainingBlocks?: number,
    timeLeft?: Time
}

export interface ProposalMotion {
    hash: string,
    method: string,
    ayes: AccountInfo[],
    nays: AccountInfo[],
    motionIndex: number,
    threshold: number,
    end: ProposalMotionEnd // block number when voting is over
}
export interface AccountInfo {
    address: string,
    display?: string;
    email?: string;
    legal?: string;
    riot?: string;
    twitter?: string;
    web?: string;
}

