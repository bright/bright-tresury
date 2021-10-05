import { AppEventType } from '../../entities/app-event-type'

export interface NewProposalCommentDto {
    type: AppEventType.NewProposalComment
    commentId: string
    proposalBlockchainId: number
    proposalTitle: string
    commentsUrl: string
    networkId: string
}
