import { PublicUserDto } from '../../../util/publicUser.dto'

export interface ReactionDto {
    id: string
    author: PublicUserDto
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
