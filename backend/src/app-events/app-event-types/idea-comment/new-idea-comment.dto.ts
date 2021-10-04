import { AppEventType } from '../../entities/app-event-type'

export interface NewIdeaCommentDto {
    type: AppEventType.NewIdeaComment
    ideaId: string
    ideaOrdinalNumber: number
    ideaTitle: string
    commentId: string
    commentsUrl: string
}
