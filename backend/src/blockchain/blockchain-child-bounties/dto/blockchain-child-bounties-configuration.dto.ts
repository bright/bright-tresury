import { ApiProperty } from '@nestjs/swagger'
import { NetworkPlanckValue } from '../../../utils/types'

export class BlockchainChildBountiesConfigurationDto {
    @ApiProperty({
        description: 'Minimum value in plancks for a child-bounty.',
    })
    childBountyValueMinimum!: NetworkPlanckValue

    @ApiProperty({
        description: 'Maximum number of child-bounties that can be added to a parent bounty.',
    })
    maxActiveChildBountyCount!: number
}
