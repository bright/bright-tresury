import { ApiProperty } from '@nestjs/swagger'
import { User } from '../../user.entity'

export class UserSettingsDto {
    @ApiProperty({
        description: 'Whether the user wants to receive email notifications',
    })
    isEmailNotificationEnabled: boolean

    constructor({ isEmailNotificationEnabled }: User) {
        this.isEmailNotificationEnabled = isEmailNotificationEnabled
    }
}
