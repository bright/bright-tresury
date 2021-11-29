import { ApiProperty } from '@nestjs/swagger'

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
    constructor({title, content, blockchainIndex}: {title: string, content: string, blockchainIndex: number}) {
        this.title = title
        this.content = content
        this.blockchainIndex = blockchainIndex
    }
}
