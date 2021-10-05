import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBooleanString, IsNumberString, IsOptional, IsString, IsUUID, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../utils/network.validator'
import { Nil } from '../utils/types'
import { IsValidAppEventType } from './dto/app-event-type.validator'
import { AppEventType } from './entities/app-event-type'

export class AppEventQuery {
    @ApiPropertyOptional({
        description: 'Is the app event read by user',
    })
    @IsOptional()
    @IsBooleanString()
    isRead?: Nil<string>

    @ApiPropertyOptional({
        description: 'The type of the app event',
        type: AppEventType,
    })
    @IsOptional()
    @IsString()
    @IsValidAppEventType()
    appEventType?: Nil<AppEventType>

    @ApiPropertyOptional({
        description: 'The id of the idea which app events refer to',
    })
    @IsOptional()
    @IsString()
    @IsUUID()
    ideaId?: Nil<string>

    @ApiPropertyOptional({
        description: 'The index of the proposal which app events refer to',
    })
    @IsOptional()
    @IsString()
    @IsNumberString()
    proposalIndex?: Nil<string>

    @ApiPropertyOptional({
        description: 'The network of the proposal which app events refer to',
    })
    @IsOptional()
    @IsString()
    @Validate(IsValidNetworkConstraint)
    networkId?: Nil<string>
}
