export interface AppEventDto {
    id: string
    data: AppEventData
    isRead: boolean
}

export type AppEventData =
    | NewIdeaCommentData
    | NewProposalCommentData
    | NewBountyCommentData
    | NewChildBountyCommentData
    | NewTipCommentData

export enum AppEventType {
    NewIdeaComment = 'new_idea_comment',
    NewProposalComment = 'new_proposal_comment',
    NewBountyComment = 'new_bounty_comment',
    NewChildBountyComment = 'new_child_bounty_comment',
    NewTipComment = 'new_tip_comment',
    TaggedInIdeaComment = 'tagged_in_idea_comment',
    TaggedInProposalComment = 'tagged_in_proposal_comment',
    TaggedInBountyComment = 'tagged_in_bounty_comment',
    TaggedInChildBountyComment = 'tagged_in_child_bounty_comment',
    TaggedInTipComment = 'tagged_in_tip_comment',
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

export interface NewChildBountyCommentData {
    type: AppEventType.NewChildBountyComment | AppEventType.TaggedInChildBountyComment
    commentId: string
    childBountyBlockchainId: number
    bountyBlockchainId: number
    childBountyTitle: string
    commentsUrl: string
    networkId: string
}

export interface NewTipCommentData {
    type: AppEventType.NewTipComment | AppEventType.TaggedInTipComment
    commentId: string
    tipHash: string
    tipTitle: string
    commentsUrl: string
    networkId: string
}
