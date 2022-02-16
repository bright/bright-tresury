import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'

export enum TimeFrame {
    OnChain = 'onChain',
    History = 'history',
}

export class TimeFrameQuery {
    @ApiPropertyOptional({
        description: 'Time frame',
        enum: TimeFrame,
    })
    @IsOptional()
    @IsEnum(TimeFrame)
    timeFrame: TimeFrame = TimeFrame.OnChain
}
