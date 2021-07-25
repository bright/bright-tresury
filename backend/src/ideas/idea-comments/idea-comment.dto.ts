import { ApiProperty } from '@nestjs/swagger'

export class IdeaCommentDto {
    @ApiProperty()
    id: string
    @ApiProperty()
    userId: string
    @ApiProperty()
    username: string
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
        userId,
        username,
        timestamp,
        thumbsUpCount,
        thumbsDownCount,
        content,
    }: {
        id: string
        userId: string
        username: string
        timestamp: number
        thumbsUpCount: number
        thumbsDownCount: number
        content: string
    }) {
        this.id = id
        this.userId = userId
        this.username = username
        this.timestamp = timestamp
        this.thumbsUpCount = thumbsUpCount
        this.thumbsDownCount = thumbsDownCount
        this.content = content
    }
}
