import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CommentParam {
    @ApiProperty({
        description: 'Comment id',
    })
    @IsNotEmpty()
    commentId!: string
}
