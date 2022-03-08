import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { DiscussionCategory } from '../entites/discussion-category'

export class DiscussionDto {
    @ApiProperty({
        description: 'Discussion category',
    })
    @IsNotEmpty()
    @IsEnum(DiscussionCategory)
    category: DiscussionCategory

    constructor(category: DiscussionCategory) {
        this.category = category
    }
}
