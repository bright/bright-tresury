import { ReactionDto } from './comment/reactions/reactions.dto'
import { PublicUserDto } from '../util/publicUser.dto'

export interface CommentDto {
    id: string
    author: PublicUserDto
    createdAt: number
    updatedAt: number
    content: string
    reactions: ReactionDto[]
}

export interface ProposalDiscussionDto {
    category: DiscussionCategory.Proposal
    blockchainIndex: number
    networkId: string
}

export interface BountyDiscussionDto {
    category: DiscussionCategory.Bounty
    blockchainIndex: number
    networkId: string
}

export interface IdeaDiscussionDto {
    category: DiscussionCategory.Idea
    entityId: string
}

export type DiscussionDto = ProposalDiscussionDto | BountyDiscussionDto | IdeaDiscussionDto

export interface CreateCommentDto {
    content: string
    discussionDto: DiscussionDto
}

export enum DiscussionCategory {
    Bounty = 'bounty',
    Proposal = 'proposal',
    Idea = 'idea',
}

export interface EditCommentDto {
    id: string
    content: string
}
