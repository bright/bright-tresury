import { ApiProperty } from '@nestjs/swagger'
import { NetworkPlanckValue } from '../../../utils/types'

export class BountiesBlockchainConfigurationDto {
    @ApiProperty({
        description: 'The amount in plancks held on deposit for placing a bounty proposal',
    })
    depositBase!: NetworkPlanckValue

    @ApiProperty({
        description: 'The amount in plancks held on deposit per byte within the bounty description',
    })
    dataDepositPerByte!: NetworkPlanckValue
}
