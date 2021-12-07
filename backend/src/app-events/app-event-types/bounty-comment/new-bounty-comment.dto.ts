import { AppEventType } from '../../entities/app-event-type'

export interface NewBountyCommentDto {
    type: AppEventType.NewBountyComment
    commentId: string
    bountyBlockchainId: number
    bountyTitle: string
    commentsUrl: string
    networkId: string
    websiteUrl: string
}
