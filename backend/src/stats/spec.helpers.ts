import { StatsDto } from './stats.dto'
import { getLogger } from '../logging.module'
import { NetworkPlanckValue } from '../utils/types'

export const mockedStatsService = {
    getStats: async (): Promise<StatsDto> => {
        getLogger().info('Mock implementation of getProposals')
        return{
            submitted: 1,
            approved: 2,
            rejected: 3,
            spendPeriod: {
                days: 1,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0,
            },
            timeLeft: {
                days: 1,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0,
            },
            leftOfSpendingPeriod: 1,
            availableBalance: '100' as NetworkPlanckValue,
            nextFoundsBurn: '100' as NetworkPlanckValue
        }
    },
}
