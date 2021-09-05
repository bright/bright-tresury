import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCommentDto {
    @ApiProperty({
        description: 'Comment content',
    })
    @IsNotEmpty()
    @IsString()
    content: string
    constructor(content: string) {
        this.content = content
    }
}
