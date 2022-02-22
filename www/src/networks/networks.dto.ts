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
    bond: {
        minValue: NetworkPlanckValue
        percentage: number
        maxValue: Nil<NetworkPlanckValue>
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
    version: number
    polkassemblyUrl: string
}
