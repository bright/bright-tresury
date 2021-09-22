export enum IdeaStatus {
    Draft = 'draft',
    Active = 'active',
    TurnedIntoProposal = 'turned_into_proposal',
    // an idea is in the below status when at least one it's milestone was turned into proposal
    MilestoneSubmission = 'milestone_submission',
    Closed = 'closed',
}

export const DefaultIdeaStatus = IdeaStatus.Draft
