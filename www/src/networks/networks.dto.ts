import { DefinitionRpcExt } from '@polkadot/types/types'
import { NetworkPlanckValue, Nil } from '../util/types'

export interface Network {
    id: string
    name: string
    url: string
    customTypes: unknown
    ss58Format: number
    genesisHash: string
    rpc: Record<string, Record<string, DefinitionRpcExt>>
    developmentKeyring: boolean
    proposals: {
        proposalBondMinimum: NetworkPlanckValue
        proposalBond: number
        proposalBondMaximum: Nil<NetworkPlanckValue>
    }
    currency: string
    decimals: number
    color: string
    isDefault: boolean
    isLiveNetwork: boolean
    bounties: {
        depositBase: NetworkPlanckValue
        dataDepositPerByte: NetworkPlanckValue
        bountyValueMinimum: NetworkPlanckValue
        maximumReasonLength: number
    }
    tips: {
        dataDepositPerByte: NetworkPlanckValue
        tipReportDepositBase: NetworkPlanckValue
        maximumReasonLength: number
        tipCountdown: number
        tipFindersFee: number
    }
    childBounties: {
        childBountyValueMinimum: NetworkPlanckValue
        maxActiveChildBountyCount: number
    }
    version: number
    polkassemblyUrl: string
}
