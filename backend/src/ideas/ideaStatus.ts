export enum IdeaStatus {
    Draft = 'draft',
    Active = 'active',
    TurnedIntoProposal = 'turned_into_proposal',
    // an idea is in the below status when at least one it's milestone was turned into proposal
    TurnedIntoProposalByMilestone = 'turned_into_proposal_by_milestone',
    Closed = 'closed',
}

export const DefaultIdeaStatus = IdeaStatus.Draft
