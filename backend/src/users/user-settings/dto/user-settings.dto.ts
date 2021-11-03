import { ApiProperty } from '@nestjs/swagger'
import { UserEntity } from '../../user.entity'

export class UserSettingsDto {
    @ApiProperty({
        description: 'Whether the user wants to receive email notifications',
    })
    isEmailNotificationEnabled: boolean

    constructor({ isEmailNotificationEnabled }: UserEntity) {
        this.isEmailNotificationEnabled = isEmailNotificationEnabled
    }
}
