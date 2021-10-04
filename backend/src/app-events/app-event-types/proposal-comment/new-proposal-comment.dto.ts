import { AppEventType } from '../../entities/app-event-type'

export interface NewProposalCommentDto {
    type: AppEventType.NewProposalComment
    proposalBlockchainId: string
    title: string
    commentId: string
    networkId: string
}
