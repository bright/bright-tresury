import { ApiProperty } from '@nestjs/swagger'

export class PolkassemblyPostEventDto {
    @ApiProperty({
        description: 'Name of the event',
    })
    eventName: string
    @ApiProperty({
        description: 'Number of block when event emitted',
    })
    blockNumber: number

    @ApiProperty({
        description: 'Start date and time of block when event emitted',
    })
    blockDateTime: string

    constructor({
        eventName,
        blockNumber,
        blockDateTime,
    }: {
        eventName: string
        blockNumber: number
        blockDateTime: string
    }) {
        this.eventName = eventName
        this.blockNumber = blockNumber
        this.blockDateTime = blockDateTime
    }
}
