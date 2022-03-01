import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsUUID } from 'class-validator'
import { Nil } from '../utils/types'
import { TimeFrameQuery } from '../utils/time-frame.query'
import { BlockchainBountyStatus } from '../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'

export class BountyFilterQuery extends TimeFrameQuery {
    @ApiPropertyOptional({
        description: 'Bounty owner id',
    })
    @IsOptional()
    @IsUUID()
    ownerId?: Nil<string>

    @ApiPropertyOptional({
        description: 'Bounty status',
        enum: BlockchainBountyStatus,
    })
    @IsOptional()
    @IsEnum(BlockchainBountyStatus)
    status?: Nil<BlockchainBountyStatus>
}
