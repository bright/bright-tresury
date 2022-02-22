export interface PolkassemblyBountyPostSchema {
    id: number
    title: string
    content: string
    onchain_link: {
        id: number
        proposer_address: string
        onchain_bounty_id: number
        onchain_bounty: {
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
        }[]
    }
}

export type OffchainPolkassemblyBountyStatus = 'BountyClaimed' | 'BountyRejected'
