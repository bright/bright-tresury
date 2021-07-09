import { Time } from '@polkadot/util/types'

export interface StatsDto {
    submitted: number
    approved: number
    rejected: number
    spendPeriod: Time
    timeLeft: Time
    leftOfSpendingPeriod: number
    availableBalance: string
    nextFoundsBurn: string
}
