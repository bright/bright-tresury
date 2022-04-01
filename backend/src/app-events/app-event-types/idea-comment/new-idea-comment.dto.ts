import { AppEventType } from '../../entities/app-event-type'

export interface NewIdeaCommentDto {
    type: AppEventType.NewIdeaComment | AppEventType.TaggedInIdeaComment
    ideaId: string
    ideaOrdinalNumber: number
    ideaTitle: string
    commentId: string
    commentsUrl: string
    networkIds: string[]
    websiteUrl: string
}
