import { ApiProperty } from '@nestjs/swagger'
import { BlockchainTimeLeft } from './blockchain-time-left.dto'

export enum MotionTimeType {
    Future = 'future',
    Past = 'past',
}

export class MotionTimeDto {
    @ApiProperty({ description: 'Whether this time is in past or in future' })
    type: MotionTimeType

    @ApiProperty({ description: 'Block number' })
    blockNo: number

    @ApiProperty({ description: 'Amount of blocks' })
    blocksCount: number

    @ApiProperty({
        description: 'Time',
        type: BlockchainTimeLeft,
    })
    time: BlockchainTimeLeft

    constructor({ type, blockNo, blocksCount, time }: MotionTimeDto) {
        this.type = type
        this.blockNo = blockNo
        this.blocksCount = blocksCount
        this.time = time
    }
}
