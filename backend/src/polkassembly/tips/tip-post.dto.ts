import { PolkassemblyTipPostSchema } from './tip-post.schema'
import { NetworkPlanckValue, Nil } from '../../utils/types'
import { PolkassemblyPostEventDto } from '../dto/polkassembly-post-event.dto'
import { BlockchainTipDto } from '../../blockchain/blockchain-tips/dto/blockchain-tip.dto'
import BN from 'bn.js'
import { BlockNumber } from '@polkadot/types/interfaces'

export class PolkassemblyTipPostDto {
    title: string
    content: string
    hash: string
    reason: string
    finderAddress: string
    findersFee: Nil<string>
    closes: number | null
    status: string
    whoAddress: string
    events: PolkassemblyPostEventDto[]
    constructor(tipPost: PolkassemblyTipPostSchema) {
        const { title, content, onchain_link } = tipPost
        const { onchain_tip } = onchain_link
        const { hash, reason, finder, finderFee, closes, who, tipStatus } = onchain_tip[0]

        this.title = title
        this.content = content
        this.hash = hash
        this.reason = reason
        this.finderAddress = finder
        this.findersFee = finderFee
        this.whoAddress = who
        this.status = tipStatus[0].status
        this.closes = closes
        this.events = tipStatus.map(
            ({ status, blockNumber }) =>
                new PolkassemblyPostEventDto({
                    eventName: status,
                    blockNumber: blockNumber.number,
                    blockDateTime: blockNumber.startDateTime.toString(),
                }),
        )
    }

    asBlockchainTipDto(): BlockchainTipDto {
        return new BlockchainTipDto({
            hash: this.hash,
            reason: this.reason,
            who: this.whoAddress,
            finder: this.finderAddress,
            deposit: '0' as NetworkPlanckValue,
            closes: this.closes ? (new BN(this.closes) as BlockNumber) : null,
            findersFee: !!this.findersFee,
            tips: null,
        })
    }
}
