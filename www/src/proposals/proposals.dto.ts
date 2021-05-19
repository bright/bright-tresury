export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
    Closed = 'closed',
}

export interface ProposalDto {
    proposalIndex: number
    proposer: string
    beneficiary: string
    value: number
    bond: number
    status: ProposalStatus
    title?: string
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId?: string
    ideaMilestoneId?: string
}
