import { ApiProperty } from '@nestjs/swagger'

export class BlockchainProposalMotionEnd {
    @ApiProperty({ description: 'Block number when voting for this proposal motion ends' })
    endBlock: number
    @ApiProperty({ description: 'Amount of blocks that is left to mine until voting for this proposal motion ends' })
    remainingBlocks: number
    @ApiProperty({
        description: 'Days, hours, minutes, seconds, milliseconds until voting for this proposal motion ends',
    })
    timeLeft: { days: number; hours: number; minutes: number; seconds: number; milliseconds: number }

    constructor({ endBlock, remainingBlocks, timeLeft }: BlockchainProposalMotionEnd) {
        this.endBlock = endBlock
        this.remainingBlocks = remainingBlocks
        this.timeLeft = timeLeft
    }
}
