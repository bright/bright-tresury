export interface AppEventDto {
    id: string
    data: AppEventData
    isRead: boolean
}

export type AppEventData = NewIdeaCommentData | NewProposalCommentData

export enum AppEventType {
    NewIdeaComment = 'new_idea_comment',
    NewProposalComment = 'new_proposal_comment',
}

export interface NewIdeaCommentData {
    type: AppEventType.NewIdeaComment
    ideaId: string
    ideaOrdinalNumber: number
    ideaTitle: string
    commentId: string
    commentsUrl: string
    networkIds: string[]
}

export interface NewProposalCommentData {
    type: AppEventType.NewProposalComment
    commentId: string
    proposalBlockchainId: number
    proposalTitle: string
    commentsUrl: string
    networkId: string
}
