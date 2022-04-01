import { AppEventType } from '../../entities/app-event-type'

export interface NewBountyCommentDto {
    type: AppEventType.NewBountyComment | AppEventType.TaggedInBountyComment
    commentId: string
    bountyBlockchainId: number
    bountyTitle: string
    commentsUrl: string
    networkId: string
    websiteUrl: string
}
