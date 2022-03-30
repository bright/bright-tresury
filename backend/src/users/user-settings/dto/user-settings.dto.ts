import { ApiProperty } from '@nestjs/swagger'
import { Nil } from '../../../utils/types'
import { UserStatus } from '../../entities/user-status'
import { UserEntity } from '../../entities/user.entity'

export class UserSettingsDto {
    @ApiProperty({
        description: 'Whether the user wants to receive email notifications',
    })
    isEmailNotificationEnabled: boolean

    @ApiProperty({
        description: 'Display name of the user',
    })
    username?: Nil<string>

    constructor({ isEmailNotificationEnabled, username, status }: UserEntity) {
        this.isEmailNotificationEnabled = isEmailNotificationEnabled
        if (status === UserStatus.EmailPasswordEnabled) {
            this.username = username
        }
    }
}
