import { DefinitionRpcExt } from '@polkadot/types/types'

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
        minValue: number
        percentage: number
    }
    currency: string
    decimals: number
    color: string
    isDefault: boolean
    isLiveNetwork: boolean
}