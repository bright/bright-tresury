import { ApiProperty } from '@nestjs/swagger'
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

    @ApiProperty({
        description: 'Blockchain index fetched from polkassembly',
    })
    blockchainIndex: number

    @ApiProperty({
        description: 'Events emitted fetched from polkassembly',
        type: [PolkassemblyPostEventDto],
    })
    events: PolkassemblyPostEventDto[]

    constructor({
        title,
        content,
        blockchainIndex,
        events,
    }: {
        title: string
        content: string
        blockchainIndex: number
        events?: Nil<PolkassemblyPostEventDto[]>
    }) {
        this.title = title
        this.content = content
        this.blockchainIndex = blockchainIndex
        this.events = events ?? []
    }
}
