import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { Nil } from '../../../utils/types'

export class UpdateUserSettingsDto {
    @ApiPropertyOptional({
        description: 'Whether the user wants to receive email notifications',
    })
    @IsOptional()
    @IsBoolean()
    isEmailNotificationEnabled?: Nil<boolean>

    @ApiPropertyOptional({
        description: 'The display name of the user',
    })
    @IsOptional()
    @IsString()
    username?: Nil<string>
}
