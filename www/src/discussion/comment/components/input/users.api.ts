import { useQuery, UseQueryOptions } from 'react-query'
import { apiGet, getUrlSearchParams } from '../../../../api'
import { PublicUserDto } from '../../../../util/publicUser.dto'

const USERS_API_PATH = 'users'

interface UsersQuery {
    display: string
}

export async function getUsers(dto: UsersQuery): Promise<PublicUserDto[]> {
    const queryParams = getUrlSearchParams(dto).toString()
    return apiGet<PublicUserDto[]>(`${USERS_API_PATH}?${queryParams}`)
}

export const USERS_QUERY_KEY_BASE = 'users'

export const useGetUsers = (dto: UsersQuery, options?: UseQueryOptions<PublicUserDto[]>) => {
    return useQuery([USERS_QUERY_KEY_BASE, dto], () => getUsers(dto), options)
}
