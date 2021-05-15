import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class StartSignMessageRequestDto {
    @ApiProperty({ description: 'Blockchain address used for signing' })
    @IsNotEmpty()
    address!: string
}
