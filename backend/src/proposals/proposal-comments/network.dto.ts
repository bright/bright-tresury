import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../utils/network.validator'

export class NetworkDto {
    @ApiProperty({
        description: 'Network name',
    })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    network!: string
}
