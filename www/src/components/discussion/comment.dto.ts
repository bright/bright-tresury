import { Nil } from '../../util/types'

export interface CommentDto {
    id: string
    author: CommentAuthorDto
    createdAt: number
    updatedAt: number
    thumbsUp: number
    thumbsDown: number
    content: string
}
export interface CommentAuthorDto {
    userId: string
    web3address: Nil<string>
    username: Nil<string>
    isEmailPasswordEnabled: boolean
}
export interface CreateCommentDto {
    content: string
}

export type EditCommentDto = CreateCommentDto
