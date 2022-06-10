import { AppEventType } from '../../entities/app-event-type'

export interface NewChildBountyCommentDto {
    type: AppEventType.NewChildBountyComment | AppEventType.TaggedInChildBountyComment
    commentId: string
    childBountyBlockchainId: number
    bountyBlockchainId: number
    childBountyTitle: string
    commentsUrl: string
    networkId: string
    websiteUrl: string
}
