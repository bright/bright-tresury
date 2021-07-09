import { ApiProperty } from '@nestjs/swagger'
import { BlockchainTimeLeft } from '../blockchain/dto/blockchain-time-left.dto'

export class StatsDto {
    @ApiProperty({
        description: 'Number of submitted proposals',
    })
    submitted: number

    @ApiProperty({
        description: 'Number of approved proposals',
    })
    approved: number

    @ApiProperty({
        description: 'Number of rejected proposals',
    })
    rejected: number

    @ApiProperty({
        description: 'An object containing spend period time',
    })
    spendPeriod: BlockchainTimeLeft

    @ApiProperty({
        description: 'An object containing left time',
    })
    timeLeft: BlockchainTimeLeft

    @ApiProperty({
        description: 'Percentage left of spending period',
    })
    leftOfSpendingPeriod: number

    @ApiProperty({
        description: 'Available Balance',
    })
    availableBalance: string

    @ApiProperty({
        description: 'Next burn',
    })
    nextFoundsBurn: string

    constructor(
        submitted: number,
        approved: number,
        rejected: number,
        spendPeriod: BlockchainTimeLeft,
        timeLeft: BlockchainTimeLeft,
        leftOfSpendingPeriod: number,
        availableBalance: string,
        nextFoundsBurn: string,
    ) {
        this.submitted = submitted
        this.approved = approved
        this.rejected = rejected
        this.spendPeriod = spendPeriod
        this.timeLeft = timeLeft
        this.leftOfSpendingPeriod = leftOfSpendingPeriod
        this.availableBalance = availableBalance
        this.nextFoundsBurn = nextFoundsBurn
    }
}
