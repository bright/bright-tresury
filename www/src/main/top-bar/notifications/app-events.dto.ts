export interface AppEventDto {
    id: string
    data: AppEventData
    isRead: boolean
}

export type AppEventData = NewIdeaCommentData | NewProposalCommentData | NewBountyCommentData

export enum AppEventType {
    NewIdeaComment = 'new_idea_comment',
    NewProposalComment = 'new_proposal_comment',
    NewBountyComment = 'new_bounty_comment',
    TaggedInIdeaComment = 'tagged_in_idea_comment',
    TaggedInProposalComment = 'tagged_in_proposal_comment',
    TaggedInBountyComment = 'tagged_in_bounty_comment',
}

export interface NewIdeaCommentData {
    type: AppEventType.NewIdeaComment | AppEventType.TaggedInIdeaComment
    ideaId: string
    ideaOrdinalNumber: number
    ideaTitle: string
    commentId: string
    commentsUrl: string
    networkIds: string[]
}

export interface NewProposalCommentData {
    type: AppEventType.NewProposalComment | AppEventType.TaggedInProposalComment
    commentId: string
    proposalBlockchainId: number
    proposalTitle: string
    commentsUrl: string
    networkId: string
}

export interface NewBountyCommentData {
    type: AppEventType.NewBountyComment | AppEventType.TaggedInBountyComment
    commentId: string
    bountyBlockchainId: number
    bountyTitle: string
    commentsUrl: string
    networkId: string
}
