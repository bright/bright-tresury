import { AuthorDto } from '../../util/author.dto'

export interface CommentDto {
    id: string
    author: AuthorDto
    createdAt: number
    updatedAt: number
    thumbsUp: number
    thumbsDown: number
    content: string
}

export interface CreateCommentDto {
    content: string
}

export type EditCommentDto = CreateCommentDto
