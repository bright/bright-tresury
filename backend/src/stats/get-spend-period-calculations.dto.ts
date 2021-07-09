import { BlockchainTimeLeft } from '../blockchain/dto/blockchain-time-left.dto'

export class GetSpendPeriodCalculationsDto {
    spendPeriod: BlockchainTimeLeft
    timeLeft: BlockchainTimeLeft
    leftOfSpendingPeriod: number

    constructor(spendPeriod: BlockchainTimeLeft, timeLeft: BlockchainTimeLeft, leftOfSpendingPeriod: number) {
        this.spendPeriod = spendPeriod
        this.timeLeft = timeLeft
        this.leftOfSpendingPeriod = leftOfSpendingPeriod
    }
}
