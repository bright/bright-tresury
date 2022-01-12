import { DeriveAccountRegistration } from '@polkadot/api-derive/types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class BlockchainAccountInfo {
    @ApiProperty({ description: 'Account address' })
    address: string

    @ApiPropertyOptional({ description: 'On-chain stored account display name' })
    display?: string

    @ApiPropertyOptional({ description: 'On-chain stored account email' })
    email?: string

    @ApiPropertyOptional({ description: 'On-chain stored account legal name' })
    legal?: string

    @ApiPropertyOptional({ description: 'On-chain stored account riot handle' })
    riot?: string

    @ApiPropertyOptional({ description: 'On-chain stored account twitter handle' })
    twitter?: string

    @ApiPropertyOptional({ description: 'On-chain stored account web page address' })
    web?: string

    constructor({ address, display, email, legal, riot, twitter, web }: BlockchainAccountInfo) {
        this.address = address
        this.display = display
        this.email = email
        this.legal = legal
        this.riot = riot
        this.twitter = twitter
        this.web = web
    }
}

export function toBlockchainAccountInfo(
    address: string,
    deriveAccountRegistration: DeriveAccountRegistration | undefined,
): BlockchainAccountInfo {
    return new BlockchainAccountInfo({
        address,
        ...(deriveAccountRegistration ?? {}),
    })
}
