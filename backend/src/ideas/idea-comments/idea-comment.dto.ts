import { ApiProperty } from '@nestjs/swagger'

export class IdeaCommentDto {
    @ApiProperty()
    id: string
    @ApiProperty()
    author: {
        userId: string
        username?: string
        web3address?: string
    }
    @ApiProperty()
    timestamp: number
    @ApiProperty()
    thumbsUpCount: number
    @ApiProperty()
    thumbsDownCount: number
    @ApiProperty()
    content: string

    constructor({
        id,
        author,
        timestamp,
        thumbsUpCount,
        thumbsDownCount,
        content,
    }: {
        id: string
        author: { userId: string; username?: string; web3address?: string }
        timestamp: number
        thumbsUpCount: number
        thumbsDownCount: number
        content: string
    }) {
        this.id = id
        this.author = author
        this.timestamp = timestamp
        this.thumbsUpCount = thumbsUpCount
        this.thumbsDownCount = thumbsDownCount
        this.content = content
    }
}
