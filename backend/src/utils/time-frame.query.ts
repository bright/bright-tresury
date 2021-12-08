import { ApiPropertyOptional } from '@nestjs/swagger'
import { Nil } from './types'
import { IsOptional } from 'class-validator'

export enum TimeFrame {
    OnChain = 'OnChain',
    History = 'History'
}

export class TimeFrameQuery {
    @ApiPropertyOptional({
        description: 'Time frame',
        enum: TimeFrame
    })
    @IsOptional()
    timeFrame?: TimeFrame
}
