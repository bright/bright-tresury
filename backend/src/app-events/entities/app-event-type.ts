import { NewBountyCommentDto } from '../app-event-types/bounty-comment/new-bounty-comment.dto'
import { NewIdeaCommentDto } from '../app-event-types/idea-comment/new-idea-comment.dto'
import { NewProposalCommentDto } from '../app-event-types/proposal-comment/new-proposal-comment.dto'

export enum AppEventType {
    NewIdeaComment = 'new_idea_comment',
    NewProposalComment = 'new_proposal_comment',
    NewBountyComment = 'new_bounty_comment',
    TaggedInIdeaComment = 'tagged_in_idea_comment',
    TaggedInProposalComment = 'tagged_in_proposal_comment',
    TaggedInBountyComment = 'tagged_in_bounty_comment',
}
export type AppEventData = NewIdeaCommentDto | NewProposalCommentDto | NewBountyCommentDto
