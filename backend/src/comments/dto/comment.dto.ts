import { ApiProperty } from '@nestjs/swagger'
import { IdeaCommentEntity } from '../../ideas/idea-comments/entities/idea-comment.entity'
import { IsNotEmpty, IsString } from 'class-validator'
import { CommentAuthorDto } from './comment-author.dto'
import { CommentEntity } from '../comment.entity'

export class CommentDto {
    @ApiProperty({ description: 'Comment Id' })
    id: string

    @ApiProperty({ description: 'Information about comment author', type: CommentAuthorDto })
    author: CommentAuthorDto

    @ApiProperty({ description: 'Create date as timestamp ' })
    createdAt: number

    @ApiProperty({ description: 'Update date as timestamp ' })
    updatedAt: number

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

    constructor({ id, author, createdAt, updatedAt, thumbsUp, thumbsDown, content }: CommentEntity) {
        this.id = id
        this.author = new CommentAuthorDto(author)
        this.createdAt = createdAt.getTime()
        this.updatedAt = updatedAt.getTime()
        this.thumbsUp = thumbsUp
        this.thumbsDown = thumbsDown
        this.content = content
    }
}
