import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { ConfirmSignMessageRequestDto } from '../../signMessage/confirm-sign-message-request.dto'

export class ConfirmWeb3SignUpRequestDto extends ConfirmSignMessageRequestDto {
    @ApiProperty({ description: 'Network used for signing the message' })
    @IsNotEmpty()
    network!: string
}
