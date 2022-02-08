import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class StartSignMessageRequestDto {
    @ApiProperty({ description: 'Web3 address used for signing' })
    @IsNotEmpty()
    address!: string
}
