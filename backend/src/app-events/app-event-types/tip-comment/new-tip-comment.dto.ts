import { AppEventType } from '../../entities/app-event-type'

export interface NewTipCommentDto {
    type: AppEventType.NewTipComment | AppEventType.TaggedInTipComment
    commentId: string
    tipHash: string
    tipTitle: string
    commentsUrl: string
    networkId: string
    websiteUrl: string
}
