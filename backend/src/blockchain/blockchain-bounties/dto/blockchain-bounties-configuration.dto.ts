import { ApiProperty } from '@nestjs/swagger'
import { NetworkPlanckValue } from '../../../utils/types'

export class BlockchainBountiesConfigurationDto {
    @ApiProperty({
        description: 'The amount in plancks held on deposit for placing a bounty proposal',
    })
    depositBase!: NetworkPlanckValue

    @ApiProperty({
        description: 'The amount in plancks held on deposit per byte within the bounty description',
    })
    dataDepositPerByte!: NetworkPlanckValue

    @ApiProperty({
        description: 'Maximum acceptable reason length',
    })
    maximumReasonLength!: number

    @ApiProperty({
        description: 'Minimum value in plancks for a bounty',
    })
    bountyValueMinimum!: NetworkPlanckValue
}
