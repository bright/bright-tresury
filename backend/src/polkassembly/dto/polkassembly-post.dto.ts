import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Nil } from '../../utils/types'
import { PolkassemblyPostEventDto } from './polkassembly-post-event.dto'

export class PolkassemblyPostDto {
    @ApiProperty({
        description: 'Title fetched from polkassembly',
    })
    title: string
    @ApiProperty({
        description: 'Description fetched from polkassembly',
    })
    content: string

    @ApiPropertyOptional({
        description: 'Blockchain index fetched from polkassembly',
    })
    blockchainIndex?: Nil<number>

    @ApiPropertyOptional({
        description: 'Blockchain hash fetched from polkassembly',
    })
    blockchainHash?: Nil<string>

    @ApiProperty({
        description: 'Events emitted fetched from polkassembly',
        type: [PolkassemblyPostEventDto],
    })
    events: PolkassemblyPostEventDto[]

    constructor({
        title,
        content,
        blockchainIndex,
        blockchainHash,
        events,
    }: {
        title: string
        content: string
        blockchainIndex: number
        blockchainHash: string
        events?: Nil<PolkassemblyPostEventDto[]>
    }) {
        this.title = title
        this.content = content
        this.blockchainIndex = blockchainIndex
        this.blockchainHash = blockchainHash
        this.events = events ?? []
    }
}
