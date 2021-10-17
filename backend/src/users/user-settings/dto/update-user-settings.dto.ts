import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'

export class UpdateUserSettingsDto {
    @ApiPropertyOptional({
        description: 'Whether the user wants to receive email notifications',
    })
    @IsOptional()
    @IsBoolean()
    isEmailNotificationEnabled?: boolean
}
