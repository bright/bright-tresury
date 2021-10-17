export interface UserSettingsDto {
    isEmailNotificationEnabled: boolean
}

export type EditUserSettingsDto = Partial<UserSettingsDto>
