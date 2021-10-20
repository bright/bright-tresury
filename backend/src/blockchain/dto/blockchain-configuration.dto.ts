import { ApiProperty } from '@nestjs/swagger'
import { BlockchainConfig } from '../blockchain.config'

export class BlockchainConfigurationDto {
    @ApiProperty({
        description: 'Id of the supported blockchain',
    })
    id: string

    @ApiProperty({
        description: 'Name of the supported blockchain',
    })
    name: string

    @ApiProperty({ description: 'Url pointing to the blockchain node' })
    url: string

    @ApiProperty({
        description:
            'Additional types used by runtime modules. This is necessary if the runtime modules uses types not available in the base Substrate runtime.',
    })
    types: any

    @ApiProperty({ description: '' })
    rpc: any

    @ApiProperty({ description: 'Should we use development accounts when using this configuration' })
    developmentKeyring: boolean

    @ApiProperty({ description: 'ss58 format' })
    ss58Format: number

    @ApiProperty({ description: 'Genesis Hash of the blockchain' })
    genesisHash: string

    @ApiProperty({
        description: 'Bond values used when we submit new proposal. Supported properties: minValue and percentage',
    })
    bond: {
        minValue: number
        percentage: number
    }

    @ApiProperty({ description: 'Ticker to use for the currency used by the blockchain' })
    currency: string

    @ApiProperty({ description: 'Decimal precision' })
    decimals: number

    @ApiProperty({ description: 'Theme color that is used in frontend for this configuration' })
    color: string

    @ApiProperty({ description: 'Should this network be used as default' })
    isDefault: boolean

    @ApiProperty({ description: 'Is this a live network or a development one' })
    isLiveNetwork: boolean

    constructor({
        id,
        name,
        url,
        types,
        rpc,
        developmentKeyring,
        ss58Format,
        genesisHash,
        bond,
        currency,
        decimals,
        color,
        isDefault,
        isLiveNetwork,
    }: BlockchainConfig) {
        this.id = id
        this.name = name
        this.url = url
        this.types = types
        this.rpc = rpc
        this.developmentKeyring = developmentKeyring
        this.ss58Format = ss58Format
        this.genesisHash = genesisHash
        this.bond = bond
        this.currency = currency
        this.decimals = decimals
        this.color = color
        this.isDefault = isDefault
        this.isLiveNetwork = isLiveNetwork
    }
}
