import { apiGet } from '../api'
import { useQuery } from 'react-query'
import { StatsDto } from './stats.dto'

export const STATS_API_PATH = '/stats'

function getStats(network: string) {
    return apiGet<StatsDto>(`${STATS_API_PATH}?network=${network}`)
}

export const STATS_QUERY_KEY_BASE = 'stats'

export const useStats = (network: string) => {
    return useQuery([STATS_QUERY_KEY_BASE, network], () => getStats(network))
}
