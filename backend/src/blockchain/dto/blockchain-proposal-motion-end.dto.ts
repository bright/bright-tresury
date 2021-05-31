import { ApiProperty } from '@nestjs/swagger'
import { Time } from '@polkadot/util/types'

export class BlockchainProposalMotionEnd {
    @ApiProperty({ description: 'Block number when voting for this proposal motion ends' })
    endBlock: number
    @ApiProperty({ description: 'Amount of blocks that is left to mine until voting for this proposal motion ends' })
    remainingBlocks: number
    @ApiProperty({
        description: 'Days, hours, minutes, seconds, milliseconds until voting for this proposal motion ends',
    })
    timeLeft: Time

    constructor({ endBlock, remainingBlocks, timeLeft }: BlockchainProposalMotionEnd) {
        this.endBlock = endBlock
        this.remainingBlocks = remainingBlocks
        this.timeLeft = timeLeft
    }
}
