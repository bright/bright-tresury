import { ApiPropertyOptional } from '@nestjs/swagger'
import {
    IsArray,
    IsBooleanString,
    IsEnum,
    IsNumberString,
    IsOptional,
    IsString,
    IsUUID,
    Validate,
} from 'class-validator'
import { IsValidNetworkConstraint } from '../utils/network.validator'
import { Nil } from '../utils/types'
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
        type: [AppEventType],
    })
    @IsOptional()
    @IsEnum(AppEventType, { each: true })
    @IsArray()
    appEventType?: Nil<AppEventType[]>

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
        description: 'The index of the bounty which app events refer to',
    })
    @IsOptional()
    @IsString()
    @IsNumberString()
    bountyIndex?: Nil<string>

    @ApiPropertyOptional({
        description: 'The index of the child bounty which app events refer to',
    })
    @IsOptional()
    @IsString()
    @IsNumberString()
    childBountyIndex?: Nil<string>

    @ApiPropertyOptional({
        description: 'The hash of the tip which app events refer to',
    })
    @IsOptional()
    @IsString()
    tipHash?: Nil<string>

    @ApiPropertyOptional({
        description: 'The network of the proposal which app events refer to',
    })
    @IsOptional()
    @IsString()
    @Validate(IsValidNetworkConstraint)
    networkId?: Nil<string>
}
