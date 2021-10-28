import { Schema } from 'convict'
import { booleanFormat } from '../../config/formats/boolean.format'
import { numberFormat } from '../../config/formats/number.format'
import { stringFormat } from '../../config/formats/string.format'
import { objectFormat } from '../../config/formats/object.format'
import { NetworkPlanckValue } from '../../utils/types'

export const BlockchainConfigToken = 'BlockchainConfig'

export interface BlockchainConfig {
    id: string
    name: string
    url: string
    types: any
    rpc: any
    developmentKeyring: boolean
    ss58Format: number
    genesisHash: string
    bond: {
        minValue: NetworkPlanckValue
        percentage: number
    }
    currency: string
    decimals: number
    color: string
    isDefault: boolean
    isLiveNetwork: boolean
}

export const blockchainConfigSchema: Schema<BlockchainConfig> = {
    id: {
        doc: 'Id of the blockchain',
        default: 'development-1',
        format: stringFormat,
    },
    name: {
        doc: 'Name of the blockchain',
        default: 'Development 1',
        format: stringFormat,
    },
    url: {
        doc: 'Url used to connect to Substrate node',
        default: 'ws://substrate:9944',
        format: stringFormat,
    },
    types: {
        doc:
            'Additional types used by runtime modules. This is necessary if the runtime modules uses types not available in the base Substrate runtime.',
        default: {},
        format: objectFormat,
    },
    rpc: {
        doc: 'rpc',
        default: {},
    },
    developmentKeyring: {
        doc: 'Should we use development keyring',
        default: false,
        format: booleanFormat,
    },
    ss58Format: {
        doc: 'ss58 format',
        default: 42,
        format: numberFormat,
    },
    genesisHash: {
        doc: 'Genesis Hash of the blockchain',
        default: '',
        format: stringFormat,
    },
    bond: {
        doc: 'Proposal bond information used by this blockchain',
        default: { minValue: '1000000000000' as NetworkPlanckValue, percentage: 5 },
    },
    currency: {
        doc: 'Currency ticker used',
        default: 'UNIT',
        format: stringFormat,
    },
    decimals: {
        doc: 'Decimal precision',
        default: 12,
        format: numberFormat,
    },
    color: {
        doc: 'Theme color that is used in frontend for this blockchain-configuration',
        default: '#0E65F2',
        format: stringFormat,
    },
    isDefault: {
        doc: 'Should this network be used as default',
        default: false,
        format: booleanFormat,
    },
    isLiveNetwork: {
        doc: 'Is this a live network or a development one',
        default: false,
        format: booleanFormat,
    },
}
