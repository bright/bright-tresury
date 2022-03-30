import { Nil } from '../../util/types'

export interface UserSettingsDto {
    isEmailNotificationEnabled: boolean
    username?: Nil<string>
}

export type EditUserSettingsDto = Partial<UserSettingsDto>
