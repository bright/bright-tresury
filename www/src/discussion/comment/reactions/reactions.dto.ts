import { AuthorDto } from '../../../util/author.dto'

export interface ReactionDto {
    id: string
    author: AuthorDto
    createdAt: number
    updatedAt: number
    name: ReactionType
}

export interface CreateReactionDto {
    name: ReactionType
}

export enum ReactionType {
    ThumbUp = 'thumbUp',
    ThumbDown = 'thumbDown',
}
