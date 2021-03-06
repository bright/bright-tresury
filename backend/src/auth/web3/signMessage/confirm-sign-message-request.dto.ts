import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ConfirmSignMessageRequestDto {
    @ApiProperty({ description: 'Web3 address used for signing' })
    @IsNotEmpty()
    address!: string

    @ApiProperty({ description: 'Message signature' })
    @IsNotEmpty()
    signature!: string
}
