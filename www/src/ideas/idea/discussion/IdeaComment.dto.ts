export interface IdeaCommentDto {
    id: string
    userId: string
    username: string
    timestamp: number
    thumbsUpCount: number
    thumbsDownCount: number
    content: string
}
export interface CreateIdeaCommentDto {
    content: string
}
