import { ApiProperty } from '@nestjs/swagger'
import { NetworkPlanckValue } from '../../../utils/types'

export class BlockchainTipsConfigurationDto {
    @ApiProperty({
        description: 'The amount in plancks held on deposit per byte within the tip description',
    })
    dataDepositPerByte!: NetworkPlanckValue

    @ApiProperty({
        description: 'Maximum acceptable reason length',
    })
    maximumReasonLength!: number

    @ApiProperty({
        description: 'The period in blocks count for which a tip remains open after is has achieved threshold tippers.',
    })
    tipCountdown!: number

    @ApiProperty({
        description: 'The percent of the final tip which goes to the original reporter of the tip',
    })
    tipFindersFee!: number

    @ApiProperty({
        description: 'The amount held on deposit for placing a tip report.',
    })
    tipReportDepositBase!: NetworkPlanckValue
}
