import { Inject, Injectable } from '@nestjs/common'
import { BlockchainsConnections } from '../blockchain.module'
import { getApi } from '../utils'
import { encodeAddress } from '@polkadot/keyring'
import { NetworkPlanckValue } from '../../utils/types'
import { BlockchainTipDto } from './dto/blockchain-tip.dto'
import { hexToString } from '@polkadot/util'

@Injectable()
export class BlockchainTipsService {
    constructor(@Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections) {}

    async getTips(networkId: string): Promise<BlockchainTipDto[]> {
        const api = getApi(this.blockchainsConnections, networkId)

        const entries = (await api.query.tips.tips.entries()).filter(([_, option]) => option.isSome)

        return Promise.all(
            entries.map(async ([storageKey, optionOpenTip]) => {
                const openTip = optionOpenTip.unwrap()
                const hash = storageKey.hash.toHex()
                const optionReason = await api.query.tips.reasons(openTip.reason)
                const reason = optionReason.isSome ? hexToString(optionReason.unwrap().toHex()) : null
                const who = encodeAddress(openTip.who.toString())
                const finder = encodeAddress(openTip.finder.toString())
                const deposit = openTip.deposit.toString() as NetworkPlanckValue
                const closes = openTip.closes.unwrapOr(null)?.toBn()
                const tips = openTip.tips.map(([account, amount]) => ({
                    tipper: encodeAddress(account.toString()),
                    value: amount.toString() as NetworkPlanckValue,
                }))
                const findersFee = openTip.findersFee.isTrue
                return { hash, reason, who, finder, deposit, closes, tips, findersFee }
            }),
        )
    }
}
