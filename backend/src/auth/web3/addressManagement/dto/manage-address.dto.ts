import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ManageAddressRequestDto {
    @ApiProperty({ description: 'Blockchain address to unlink' })
    @IsNotEmpty()
    address!: string
}
