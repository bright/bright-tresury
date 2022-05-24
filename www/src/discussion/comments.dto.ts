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

export interface ChildBountyDiscussionDto {
    category: DiscussionCategory.ChildBounty
    blockchainIndex: number
    parentBountyBlockchainIndex: number
    networkId: string
}

export interface IdeaDiscussionDto {
    category: DiscussionCategory.Idea
    entityId: string
}

export interface TipDiscussionDto {
    category: DiscussionCategory.Tip
    blockchainHash: string
    networkId: string
}

export type DiscussionDto =
    | ProposalDiscussionDto
    | BountyDiscussionDto
    | ChildBountyDiscussionDto
    | IdeaDiscussionDto
    | TipDiscussionDto

export interface CreateCommentDto {
    content: string
    discussionDto: DiscussionDto
}

export enum DiscussionCategory {
    Bounty = 'bounty',
    ChildBounty = 'childBounty',
    Proposal = 'proposal',
    Idea = 'idea',
    Tip = 'tip',
}

export interface EditCommentDto {
    id: string
    content: string
}
