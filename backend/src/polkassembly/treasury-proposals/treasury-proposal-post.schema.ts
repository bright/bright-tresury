export interface PolkassemblyTreasuryProposalPostSchema {
    id: number
    content: string
    title: string
    onchain_link: {
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
}
