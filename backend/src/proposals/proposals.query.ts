import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../utils/network.validator'

export class ProposalsQuery {
    @ApiProperty({
        description: 'Network name',
    })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    network!: string
}
