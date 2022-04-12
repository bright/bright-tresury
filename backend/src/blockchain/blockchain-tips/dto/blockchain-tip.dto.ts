import { NetworkPlanckValue, Nil } from '../../../utils/types'
import BN from 'bn.js'
import { BlockNumber } from '@polkadot/types/interfaces'

export interface BlockchainTipDto {
    hash: string
    reason: Nil<string>
    who: string
    finder: string
    deposit: NetworkPlanckValue
    closes: Nil<BlockNumber>
    tips: {
        tipper: string
        value: NetworkPlanckValue
    }[]
    findersFee: boolean
}
