import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { apiGet, apiPatch } from '../../api'
import { EditUserSettingsDto, UserSettingsDto } from './user-settings.dto'

const getUsersSettingsApiPath = (userId: string) => `users/${userId}/settings`

// GET ONE

async function getUserSettings(userId: string): Promise<UserSettingsDto> {
    return apiGet<UserSettingsDto>(getUsersSettingsApiPath(userId))
}

export const USER_SETTINGS_QUERY_KEY_BASE = 'user_settings'

export const useGetUserSettings = ({ userId }: { userId: string }, options?: UseQueryOptions<UserSettingsDto>) => {
    return useQuery([USER_SETTINGS_QUERY_KEY_BASE, userId], () => getUserSettings(userId), options)
}

// PATCH

async function patchUserSettings({ userId, dto }: { userId: string; dto: EditUserSettingsDto }) {
    return apiPatch<UserSettingsDto>(getUsersSettingsApiPath(userId), dto)
}

export const usePatchUserSettings = () => {
    return useMutation(patchUserSettings)
}
