import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { NetworkPlanckValue, Nil } from '../../../utils/types'

export class BlockchainProposalsConfigurationDto {
    @ApiProperty({
        description: 'Minimum value in plancks for a proposal bond.',
    })
    proposalBondMinimum!: NetworkPlanckValue

    @ApiPropertyOptional({
        description: 'Maximum value in plancks for a proposal bond.',
    })
    proposalBondMaximum: Nil<NetworkPlanckValue>

    @ApiProperty({
        description: 'Percentage value in plancks for a proposal bond.',
    })
    proposalBond!: number
}
