import { PostSchema } from '../fragments/post.schema'

interface TipSchema {
    id: number
    hash: string
    reason: string
    finder: string
    finderFee: string | null
    closes: number
    tipStatus: {
        id: number
        status: string
        blockNumber: {
            startDateTime: number
            number: number
        }
    }[]
    who: string
}

interface TipOnchainLinkSchema {
    onchain_tip_id: string
    onchain_tip: TipSchema[]
}

export type PolkassemblyTipPostSchema = PostSchema<TipOnchainLinkSchema>
