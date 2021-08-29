import { Nil } from '../../../util/types'

export interface IdeaCommentDto {
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
export interface CreateIdeaCommentDto {
    content: string
}

export type UpdateIdeaCommentDto = CreateIdeaCommentDto
