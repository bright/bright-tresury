import { CreateCommentDto } from '../../comments/dto/create-comment.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../utils/network.validator'

export class CreateProposalCommentDto extends CreateCommentDto {
    @ApiProperty({
        description: 'Network name',
    })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    network!: string
}
