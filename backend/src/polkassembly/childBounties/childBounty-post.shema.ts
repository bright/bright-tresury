import { PostSchema } from '../fragments/post.schema'

interface ChildBountySchema {
    id: number
    value: string
    fee: string
    curatorDeposit: string
    curator: string
    parentBountyId: number
    childBountyId: number
    beneficiary: string
    childBountyStatus: {
        id: string
        status: string
        blockNumber: {
            startDateTime: number
            number: number
        }
    }[]
    description: string
    proposer: string
}

interface ChildBountyOnchainLinkSchema {
    onchain_child_bounty_id: number
    onchain_child_bounty: ChildBountySchema[]
}

export type PolkassemblyChildBountyPostSchema = PostSchema<ChildBountyOnchainLinkSchema>
