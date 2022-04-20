import { PostSchema } from '../fragments/post.schema'

interface BountySchema {
    id: number
    value: string
    fee: string
    curatorDeposit: string
    bond: string
    bountyId: number
    curator: string
    beneficiary: string
    bountyStatus: {
        id: string
        status: OffchainPolkassemblyBountyStatus
        blockNumber: {
            startDateTime: number
            number: number
        }
    }[]
}

interface BountyOnchainLinkSchema {
    proposer_address: string
    onchain_bounty_id: number
    onchain_bounty: BountySchema[]
}

export type PolkassemblyBountyPostSchema = PostSchema<BountyOnchainLinkSchema>
export type OffchainPolkassemblyBountyStatus = 'BountyClaimed' | 'BountyRejected'
