import { ApiProperty } from '@nestjs/swagger'
import { AuthorDto } from '../../utils/author.dto'
import { CommentEntity } from '../entites/comment.entity'

export class CommentDto {
    @ApiProperty({ description: 'Comment Id' })
    id: string

    @ApiProperty({ description: 'Information about comment author', type: AuthorDto })
    author: AuthorDto

    @ApiProperty({ description: 'Create date as timestamp ' })
    createdAt: number

    @ApiProperty({ description: 'Update date as timestamp ' })
    updatedAt: number

    @ApiProperty({
        description: 'Comment content',
    })
    content: string

    constructor({ id, author, createdAt, updatedAt, content }: CommentEntity) {
        this.id = id
        this.author = new AuthorDto(author)
        this.createdAt = createdAt.getTime()
        this.updatedAt = updatedAt.getTime()
        this.content = content
    }
}
