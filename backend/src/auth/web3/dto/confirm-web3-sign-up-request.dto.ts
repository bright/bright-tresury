import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { ConfirmWeb3SignRequestDto } from './confirm-web3-sign-request.dto'

export class ConfirmWeb3SignUpRequestDto extends ConfirmWeb3SignRequestDto {
    @ApiProperty({ description: 'Network used for signing the message' })
    @IsNotEmpty()
    network!: string
}
