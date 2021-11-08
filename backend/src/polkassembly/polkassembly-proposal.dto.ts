import { ApiProperty } from '@nestjs/swagger'

export class PolkassemblyProposalDto {
    @ApiProperty({
        description: 'Proposal title fetched from polkassembly',
    })
    title: string
    @ApiProperty({
        description: 'Proposal description fetched from polkassembly',
    })
    content: string

    @ApiProperty({
        description: 'Proposal index fetched from polkassembly',
    })
    proposalIndex: number
    constructor({title, content, proposalIndex}: {title: string, content: string, proposalIndex: number}) {
        this.title = title
        this.content = content
        this.proposalIndex = proposalIndex
    }
}
