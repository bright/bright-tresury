import { Time } from '@polkadot/util/types'
import { ApiProperty } from '@nestjs/swagger'

export class BlockchainTimeLeft {
    @ApiProperty({ description: 'Days until some point in the future' })
    days: number
    @ApiProperty({ description: 'Hours until some point in the future' })
    hours: number
    @ApiProperty({ description: 'Minutes until some point in the future' })
    minutes: number
    @ApiProperty({ description: 'Seconds until some point in the future' })
    seconds: number
    @ApiProperty({ description: 'Milliseconds until some point in the future' })
    milliseconds: number

    constructor({ days, hours, minutes, seconds, milliseconds }: Time) {
        this.days = days
        this.hours = hours
        this.minutes = minutes
        this.seconds = seconds
        this.milliseconds = milliseconds
    }
}
