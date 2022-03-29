import { ApiProperty } from '@nestjs/swagger'
import { CommentEntity } from '../entites/comment.entity'
import { ReactionDto } from '../reactions/dto/reaction.dto'
import { PublicUserDto } from '../../users/dto/public-user.dto'

export class CommentDto {
    @ApiProperty({ description: 'Comment Id' })
    id: string

    @ApiProperty({ description: 'Information about comment author', type: PublicUserDto })
    author: PublicUserDto

    @ApiProperty({ description: 'Create date as timestamp ' })
    createdAt: number

    @ApiProperty({ description: 'Update date as timestamp ' })
    updatedAt: number

    @ApiProperty({
        description: 'Comment content',
    })
    content: string

    @ApiProperty({
        description: 'Comment reactions',
        type: [ReactionDto],
    })
    reactions: ReactionDto[]

    constructor({ id, author, createdAt, updatedAt, content, reactions }: CommentEntity) {
        this.id = id
        this.author = PublicUserDto.fromUserEntity(author)
        this.createdAt = createdAt.getTime()
        this.updatedAt = updatedAt.getTime()
        this.content = content
        this.reactions = reactions?.map((reaction) => new ReactionDto(reaction)) ?? []
    }
}
