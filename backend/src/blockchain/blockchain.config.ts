import { Schema, SchemaObj } from 'convict'
import { stringFormat } from '../config/formats/string.format'

export interface BlockchainConfig {
    nodeUrl: string
    types: any
}

export const BlockchainConfigToken = 'BlockchainConfig'

export const blockchainConfigSchema: Schema<BlockchainConfig> = {
    nodeUrl: {
        doc: 'Url used to connect to Substrate node',
        default: 'ws://substrate:9944',
        env: 'SUBSTRATE_NODE_URL',
        format: stringFormat,
    } as SchemaObj<string>,
    types: {
        doc:
            'Additional types used by runtime modules. This is necessary if the runtime modules uses types not available in the base Substrate runtime.',
        default: {
            Address: 'MultiAddress',
            LookupSource: 'MultiAddress',
        },
        env: 'SUBSTRATE_TYPES',
        format(value: any) {
            if (typeof value !== 'object') {
                throw new Error('must be an object')
            }
        },
    } as SchemaObj<Object>,
}
