import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, Min, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../utils/network.validator'
import { NetworkPlanckValue } from '../../NetworkPlanckValue'

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
        description: 'Reward for the idea in the network',
        type: String,
    })
    @IsNotEmpty()
    @IsNumberString({ no_symbols: true })
    value!: NetworkPlanckValue
}
