import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class Web3SignUpRequestDetails {
    @ApiProperty({ description: 'Network used for signing the message' })
    @IsNotEmpty()
    network!: string
}
