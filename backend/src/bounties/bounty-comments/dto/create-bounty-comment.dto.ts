import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'
import { CreateCommentDto } from '../../../comments/dto/create-comment.dto'
import { IsValidNetworkConstraint } from '../../../utils/network.validator'

export class CreateBountyCommentDto extends CreateCommentDto {
    @ApiProperty({
        description: 'Network name',
    })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    networkId!: string
}
