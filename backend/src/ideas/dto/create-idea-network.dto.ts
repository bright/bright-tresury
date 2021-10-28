import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString, IsOptional, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../utils/network.validator'
import { NetworkPlanckValue } from '../../utils/types'

export class CreateIdeaNetworkDto {
    @ApiPropertyOptional({
        description: 'Id of the idea network',
    })
    @IsOptional()
    id?: string

    @ApiProperty({
        description: 'Name of the network',
    })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    name!: string

    @ApiProperty({
        description: 'Reward for the idea in the network in planck',
        type: String,
    })
    @IsNotEmpty()
    @IsNumberString({ no_symbols: true })
    value!: NetworkPlanckValue
}
