import { PostSchema } from '../fragments/post.schema'

interface TreasuryProposalOnchainLinkSchema {
    id: number
    proposer_address: string
    onchain_treasury_proposal_id: number
    onchain_motion_id: number
    onchain_treasury_spend_proposal: {
        id: number
        treasuryProposalId: number
        proposer: string
        beneficiary: string
        value: string
        bond: string
        treasuryStatus: {
            id: string
            status: string
            blockNumber: {
                number: number
            }
        }[]
    }[]
}

export type PolkassemblyTreasuryProposalPostSchema = PostSchema<TreasuryProposalOnchainLinkSchema>
