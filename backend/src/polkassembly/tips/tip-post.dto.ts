import { PolkassemblyTipPostSchema } from './tip-post.schema'
import { Nil } from '../../utils/types'
import { PolkassemblyPostEventDto } from '../dto/polkassembly-post-event.dto'

export class PolkassemblyTipPostDto {
    title: string
    content: string
    hash: string
    reason: string
    finderAddress: string
    findersFee: Nil<string>
    closes: number
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
}
