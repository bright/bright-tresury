import { ApiProperty } from '@nestjs/swagger'
import { BlockchainTimeLeft } from './blockchain-time-left.dto'

export class BlockchainMotionEndDto {
    @ApiProperty({ description: 'Block number when voting for this proposal motion ends' })
    endBlock: number
    @ApiProperty({ description: 'Amount of blocks that is left to mine until voting for this proposal motion ends' })
    remainingBlocks: number
    @ApiProperty({
        description: 'Time lft until voting for this proposal motion ends',
        type: BlockchainTimeLeft,
    })
    timeLeft: BlockchainTimeLeft

    constructor({ endBlock, remainingBlocks, timeLeft }: BlockchainMotionEndDto) {
        this.endBlock = endBlock
        this.remainingBlocks = remainingBlocks
        this.timeLeft = timeLeft
    }
}
