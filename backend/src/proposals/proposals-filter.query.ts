import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsUUID } from 'class-validator'
import { Nil } from '../utils/types'
import { ProposalStatus } from './dto/proposal.dto'
import { TimeFrameQuery } from '../utils/time-frame.query'

export class ProposalsFilterQuery extends TimeFrameQuery {
    @ApiPropertyOptional({
        description: 'Proposal owner id',
    })
    @IsOptional()
    @IsUUID()
    ownerId?: Nil<string>

    @ApiPropertyOptional({
        description: 'Proposal status',
        enum: ProposalStatus,
    })
    @IsOptional()
    @IsEnum(ProposalStatus)
    status?: Nil<ProposalStatus>
}
