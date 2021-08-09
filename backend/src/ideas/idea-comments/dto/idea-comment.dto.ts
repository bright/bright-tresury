import { ApiProperty } from '@nestjs/swagger'
import { IdeaComment } from '../entities/idea-comment.entity'
import { IsNotEmpty, IsString } from 'class-validator'
import { IdeaCommentAuthorDto } from './idea-comment-author.dto'

export class IdeaCommentDto {
    @ApiProperty({ description: 'Comment Id' })
    id: string

    @ApiProperty({ description: 'Information about comment author', type: IdeaCommentAuthorDto })
    author: IdeaCommentAuthorDto

    @ApiProperty({ description: 'Create date as timestamp ' })
    createdAt: number

    @ApiProperty({ description: 'Thumbs up pressed count' })
    thumbsUp: number

    @ApiProperty({ description: 'Thumbs down pressed count' })
    thumbsDown: number

    @ApiProperty({
        description: 'Comment content',
    })
    @IsNotEmpty()
    @IsString()
    content: string

    constructor({ id, author, createdAt, thumbsUp, thumbsDown, content }: IdeaComment) {
        this.id = id
        this.author = new IdeaCommentAuthorDto(author)
        this.createdAt = createdAt.getTime()
        this.thumbsUp = thumbsUp
        this.thumbsDown = thumbsDown
        this.content = content
    }
}
