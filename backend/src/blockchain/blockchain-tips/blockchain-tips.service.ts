import { Inject, Injectable } from '@nestjs/common'
import { encodeAddress } from '@polkadot/keyring'
import { hexToString } from '@polkadot/util'
import { ExtrinsicEvent } from '../../extrinsics/extrinsicEvent'
import { getLogger } from '../../logging.module'
import { NetworkPlanckValue } from '../../utils/types'
import { BlockchainsConnections } from '../blockchain.module'
import { extractFromBlockchainEvent, getApi } from '../utils'
import { BlockchainTipDto } from './dto/blockchain-tip.dto'
import { BlockchainTipsConfigurationDto } from './dto/blockchain-tips-configuration.dto'
import { PalletTipsOpenTip } from '@polkadot/types/lookup'
import { Bytes } from '@polkadot/types'

const logger = getLogger()

@Injectable()
export class BlockchainTipsService {
    constructor(@Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections) {}

    static extractTipHash(extrinsicEvents: ExtrinsicEvent[]): string | undefined {
        logger.info('Looking for a tip proposal hash')
        return extractFromBlockchainEvent(extrinsicEvents, 'tips', 'NewTip', 0)
    }

    getTipsConfig(networkId: string): BlockchainTipsConfigurationDto | undefined {
        try {
            const tipsConsts = getApi(this.blockchainsConnections, networkId).consts.tips
            if (!tipsConsts) {
                return
            }

            const dataDepositPerByte = tipsConsts.dataDepositPerByte.toString() as NetworkPlanckValue
            const tipReportDepositBase = tipsConsts.tipReportDepositBase.toString() as NetworkPlanckValue
            const maximumReasonLength = Number(tipsConsts.maximumReasonLength)
            const tipCountdown = tipsConsts.tipCountdown.toNumber()
            const tipFindersFee = tipsConsts.tipFindersFee.toNumber()
            return {
                dataDepositPerByte,
                tipReportDepositBase,
                maximumReasonLength,
                tipCountdown,
                tipFindersFee,
            }
        } catch (err) {
            logger.error('Error while fetching tips configuration', err)
        }
    }

    async getTips(networkId: string): Promise<BlockchainTipDto[]> {
        const api = getApi(this.blockchainsConnections, networkId)
        const entries = (await api.query.tips.tips.entries()).filter(([_, option]) => option.isSome)
        return Promise.all(
            entries.map(
                async ([
                    {
                        args: [hash],
                    },
                    optionOpenTip,
                ]) => {
                    const openTip = optionOpenTip.unwrap()
                    const rawReason = (await api.query.tips.reasons(openTip.reason)).unwrapOr(null)
                    return this.createBlockchainTipDto(hash.toHex(), openTip, rawReason)
                },
            ),
        )
    }

    async getTip(networkId: string, hash: string): Promise<BlockchainTipDto | undefined> {
        const api = getApi(this.blockchainsConnections, networkId)
        const tip = await api.query.tips.tips(hash)

        if (tip.isNone) {
            return undefined
        }
        const openTip = tip.unwrap()
        const rawReason = (await api.query.tips.reasons(openTip.reason)).unwrapOr(null)
        return this.createBlockchainTipDto(hash, openTip, rawReason)
    }

    private async createBlockchainTipDto(
        hash: string,
        openTip: PalletTipsOpenTip,
        rawReason: Bytes | null,
    ): Promise<BlockchainTipDto> {
        const reason = hexToString(rawReason?.toHex())
        const who = encodeAddress(openTip.who.toString())
        const finder = encodeAddress(openTip.finder.toString())
        const deposit = openTip.deposit.toString() as NetworkPlanckValue
        const closes = openTip.closes.unwrapOr(null)
        const tips = openTip.tips.map(([account, amount]) => ({
            tipper: encodeAddress(account.toString()),
            value: amount.toString() as NetworkPlanckValue,
        }))
        const findersFee = openTip.findersFee.isTrue
        return new BlockchainTipDto({
            hash,
            reason,
            who,
            finder,
            deposit,
            closes,
            tips,
            findersFee,
        })
    }
}
