import { Schema } from 'convict'
import { stringFormat } from '../config/formats/string.format'
import { objectFormat } from '../config/formats/object.format'

export const BlockchainConfigToken = 'BlockchainConfig'

export interface BlockchainConfig {
    id: 'development' | 'polkadot' | 'kusama'
    name: 'Development' | 'Polkadot' | 'Kusama'
    url: string
    types: any
    rpc: any
    developmentKeyring: boolean
    bond: {
        minValue: number
        percentage: number
    }
    currency: string
    decimals: number
    color: string
    isDefault: boolean
}

export const blockchainConfigSchema: Schema<BlockchainConfig> = {
    id: {
        doc: 'Id of the blockchain',
        default: 'development',
        format: ['development', 'polkadot', 'kusama'],
    },
    name: {
        doc: 'Name of the blockchain',
        default: 'Development',
        format: ['Development', 'Polkadot', 'Kusama'],
    },
    url: {
        doc: 'Url used to connect to Substrate node',
        default: 'ws://substrate:9944',
        format: stringFormat,
    },
    types: {
        doc:
            'Additional types used by runtime modules. This is necessary if the runtime modules uses types not available in the base Substrate runtime.',
        default: {
            Address: 'MultiAddress',
            LookupSource: 'MultiAddress',
        },
        format: objectFormat,
    },
    rpc: {
        doc: 'rpc',
        default: {},
    },
    developmentKeyring: {
        doc: 'Should we use development keyring',
        default: false,
    },
    bond: {
        doc: 'Proposal bond information used by this blockchain',
        default: { minValue: 1000, percentage: 5 },
    },
    currency: {
        doc: 'Currency ticker used',
        default: 'UNIT',
    },
    decimals: {
        doc: 'Decimal precision',
        default: 12,
    },
    color: {
        doc: 'Theme color that is used in frontend for this configuration',
        default: '#0E65F2',
    },
    isDefault: {
        doc: 'Should this network be used as default',
        default: false,
    },
}
