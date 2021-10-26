import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsNumberString, Min } from 'class-validator'
import { NetworkPlanckValue } from '../../../NetworkPlanckValue'

export class UpdateIdeaNetworkDto {
    @ApiProperty({
        description: 'Reward for the idea in the network in Planck',
        type: String,
    })
    @IsNotEmpty()
    @IsNumberString({ no_symbols: true })
    value!: NetworkPlanckValue
}
