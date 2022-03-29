import { ApiProperty } from '@nestjs/swagger'
import { CommentReactionEntity, ReactionType } from '../entities/comment-reaction.entity'
import { PublicUserDto } from '../../../users/dto/public-user.dto'

export class ReactionDto {
    @ApiProperty({ description: 'Reaction Id' })
    id: string

    @ApiProperty({ description: 'Information about reaction author', type: PublicUserDto })
    author: PublicUserDto

    @ApiProperty({ description: 'Create date as timestamp ' })
    createdAt: number

    @ApiProperty({ description: 'Update date as timestamp ' })
    updatedAt: number

    @ApiProperty({
        description: 'Reaction name',
    })
    name: ReactionType

    constructor({ id, author, createdAt, updatedAt, name }: CommentReactionEntity) {
        this.id = id
        this.author = PublicUserDto.fromUserEntity(author)!
        this.createdAt = createdAt.getTime()
        this.updatedAt = updatedAt.getTime()
        this.name = name
    }
}
