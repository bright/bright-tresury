import { NetworkPlanckValue, Nil } from '../../../utils/types'
import BN from 'bn.js'

export interface BlockchainTipDto {
    hash: string
    reason: Nil<string>
    who: string
    finder: string
    deposit: NetworkPlanckValue
    closes: Nil<BN>
    tips: {
        tipper: string
        value: NetworkPlanckValue
    }[]
    findersFee: boolean
}
