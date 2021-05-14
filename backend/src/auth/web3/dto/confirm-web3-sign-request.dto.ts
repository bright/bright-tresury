import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ConfirmWeb3SignRequestDto {
    @ApiProperty({ description: 'Blockchain address used for sign up' })
    @IsNotEmpty()
    address!: string

    @ApiProperty({ description: 'Message signature' })
    @IsNotEmpty()
    signature!: string
}
