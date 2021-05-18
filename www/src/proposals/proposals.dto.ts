

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
    Closed = 'closed',
}

export interface ProposalDto {
    proposalIndex: number
    proposer: any
    beneficiary: any
    value: number
    bond: number
    status: ProposalStatus
    title?: string
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId?: string
    ideaMilestoneId?: string
    council: ProposalVote[]
}
export interface ProposalVote {
    hash: string,
    method: string,
    ayes: any[],
    nays: any[],
    motionIndex: number,
    threshold: number,
    end: any // block number when voting is over
}
