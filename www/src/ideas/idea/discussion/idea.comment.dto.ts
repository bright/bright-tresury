export interface IdeaCommentDto {
    id: string
    author: CommentAuthorDto
    timestamp: number
    thumbsUpCount: number
    thumbsDownCount: number
    content: string
}
export interface CommentAuthorDto {
    userId: string
    web3address?: string
    username?: string
}
export interface CreateIdeaCommentDto {
    content: string
}
