import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { ReactionType } from '../entities/comment-reaction.entity'

export class CreateReactionDto {
    @ApiProperty({
        description: 'Reaction type',
    })
    @IsNotEmpty()
    @IsEnum(ReactionType)
    name!: ReactionType
}
