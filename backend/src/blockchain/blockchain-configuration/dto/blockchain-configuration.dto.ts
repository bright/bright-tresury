import { ApiProperty } from '@nestjs/swagger'
import { BlockchainConfig } from '../blockchain-configuration.config'
import { NetworkPlanckValue } from '../../../utils/types'
import { BountiesBlockchainConfigurationDto } from '../../bounties/dto/bounties-blockchain-configuration.dto'

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

    @ApiProperty({ description: 'Url used to connect to polkassembly GraphQL server' })
    polkassemblyUrl: string

    @ApiProperty({
        description:
            'Additional types used by runtime modules. This is necessary if the runtime modules uses types not available in the base Substrate runtime.',
    })
    types: any

    @ApiProperty({ description: '' })
    rpc: any

    @ApiProperty({ description: 'Should we use development accounts when using this blockchain-configuration' })
    developmentKeyring: boolean

    @ApiProperty({ description: 'ss58 format' })
    ss58Format: number

    @ApiProperty({ description: 'Genesis Hash of the blockchain' })
    genesisHash: string

    @ApiProperty({
        description: 'Bond values used when we submit new proposal. Supported properties: minValue and percentage',
    })
    bond: {
        minValue: NetworkPlanckValue
        percentage: number
    }

    @ApiProperty({ description: 'Ticker to use for the currency used by the blockchain' })
    currency: string

    @ApiProperty({ description: 'Decimal precision' })
    decimals: number

    @ApiProperty({ description: 'Theme color that is used in frontend for this blockchain-configuration' })
    color: string

    @ApiProperty({ description: 'Should this network be used as default' })
    isDefault: boolean

    @ApiProperty({ description: 'Is this a live network or a development one' })
    isLiveNetwork: boolean

    @ApiProperty({ description: 'Bounties module configuration', type: BountiesBlockchainConfigurationDto })
    bounties: BountiesBlockchainConfigurationDto

    constructor({
        id,
        name,
        url,
        polkassemblyUrl,
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
        bounties,
    }: BlockchainConfig) {
        this.id = id
        this.name = name
        this.url = url
        this.polkassemblyUrl = polkassemblyUrl
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
        this.bounties = bounties
    }
}
