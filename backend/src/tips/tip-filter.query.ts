import { TimeFrameQuery } from '../utils/time-frame.query'
import { IsEnum, IsOptional, IsUUID } from 'class-validator'
import { Nil } from '../utils/types'
import { TipStatus } from './dto/find-tip.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class TipFilterQuery extends TimeFrameQuery {
    @ApiPropertyOptional({
        description: 'Tip owner id',
    })
    @IsOptional()
    @IsUUID()
    ownerId?: Nil<string>

    @ApiPropertyOptional({
        description: 'Tip status',
        enum: TipStatus,
    })
    @IsOptional()
    @IsEnum(TipStatus)
    status?: Nil<TipStatus>
}
