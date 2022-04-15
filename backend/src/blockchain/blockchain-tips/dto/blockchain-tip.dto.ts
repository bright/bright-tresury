import { NetworkPlanckValue, Nil } from '../../../utils/types'
import { BlockNumber } from '@polkadot/types/interfaces'
import { UserEntity } from '../../../users/entities/user.entity'

export interface ProposedBlockchainTip {
    tipper: string
    value: NetworkPlanckValue
}

export class BlockchainTipDto {
    hash!: string
    reason: Nil<string>
    who!: string
    finder!: string
    deposit!: NetworkPlanckValue
    closes!: Nil<BlockNumber>
    tips!: ProposedBlockchainTip[]
    findersFee!: boolean

    constructor({
        hash,
        reason,
        who,
        finder,
        deposit,
        closes,
        tips,
        findersFee,
    }: {
        hash: string
        reason: Nil<string>
        who: string
        finder: string
        deposit: NetworkPlanckValue
        closes: Nil<BlockNumber>
        tips: ProposedBlockchainTip[]
        findersFee: boolean
    }) {
        this.hash = hash
        this.reason = reason
        this.who = who
        this.finder = finder
        this.deposit = deposit
        this.closes = closes
        this.tips = tips
        this.findersFee = findersFee
    }

    isOwner = (user: UserEntity) => UserEntity.hasWeb3Address(user, this.finder)
}
