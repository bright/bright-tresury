import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { DiscussionCategory } from '../../entites/discussion-category'
import { DiscussionDto } from '../discussion.dto'

export class IdeaDiscussionDto extends DiscussionDto {
    @ApiProperty({
        description: 'Discussion category',
    })
    @IsNotEmpty()
    @IsString()
    category: DiscussionCategory.Idea

    @ApiProperty({ description: 'Id of the idea entity' })
    @IsNotEmpty()
    @IsUUID()
    entityId: string

    constructor(category: DiscussionCategory.Idea, entityId: string) {
        super(category)
        this.category = category
        this.entityId = entityId
    }
}
