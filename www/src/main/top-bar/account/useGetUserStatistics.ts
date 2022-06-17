import { useQuery } from 'react-query'
import { apiGet, getUrlSearchParams } from '../../../api'
import { UserStatisticsDto } from './user-statistics.dto'
import { useNetworks } from '../../../networks/useNetworks'
import { useAuth } from '../../../auth/AuthContext'

const USER_STATISTICS_QUERY_KEY_BASE = 'user_statistics'

const apiPath = (userId: string) => `/users/${userId}/statistics`

interface UseGetUserStatisticsParams {
    network: string
    userId: string
}

const getUserStatistics = ({ network, userId }: UseGetUserStatisticsParams): Promise<UserStatisticsDto> => {
    return apiGet<UserStatisticsDto>(`${apiPath(userId)}?${getUrlSearchParams({ network }).toString()}`)
}

export const useGetUserStatistics = () => {
    const { network } = useNetworks()
    const { user } = useAuth()
    return useQuery(
        [USER_STATISTICS_QUERY_KEY_BASE, user?.id, network],
        () => getUserStatistics({ network: network.id, userId: user!?.id }),
        {
            enabled: !!user?.id,
            initialData: { ideas: 0, proposals: 0, tips: 0, bounties: 0 },
        },
    )
}
