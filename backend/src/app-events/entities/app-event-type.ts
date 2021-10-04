import { NewIdeaCommentDto } from '../app-event-types/idea-comment/new-idea-comment.dto'
import { NewProposalCommentDto } from '../app-event-types/proposal-comment/new-proposal-comment.dto'

export enum AppEventType {
    NewIdeaComment = 'new_idea_comment',
    NewProposalComment = 'new_proposal_comment',
}
export type AppEventData = NewIdeaCommentDto | NewProposalCommentDto
