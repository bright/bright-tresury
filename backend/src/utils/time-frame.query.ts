import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export enum TimeFrame {
    OnChain = 'onChain',
    History = 'history'
}

export class TimeFrameQuery {
    @ApiPropertyOptional({
        description: 'Time frame',
        enum: TimeFrame
    })
    @IsOptional()
    timeFrame?: TimeFrame
}
