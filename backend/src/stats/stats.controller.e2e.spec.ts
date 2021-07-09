import { HttpStatus } from '@nestjs/common'
import { beforeSetupFullApp, request, NETWORKS } from '../utils/spec.helpers'
import { BlockchainService } from '../blockchain/blockchain.service'
import { mockedStatsService } from './spec.helpers'
import { StatsDto } from './stats.dto'

describe('Stats', () => {
    const app = beforeSetupFullApp()
    beforeAll(() => {
        jest.spyOn(app().get(BlockchainService), 'getStats').mockImplementation(mockedStatsService.getStats)
    })
    it(`GET stats response should have ${HttpStatus.OK} status code`, () => {
        return request(app()).get(`/api/v1/stats?network=${NETWORKS.POLKADOT}`).expect(HttpStatus.OK)
    })
    it.only('should return stats', async () => {
        const result = await request(app()).get(`/api/v1/stats?network=${NETWORKS.POLKADOT}`)
        const body = result.body as StatsDto

        expect(body).toEqual({
            submitted: 1,
            approved: 2,
            rejected: 3,
            spendPeriod: {
                days: 1,
                hours: 0,
                milliseconds: 0,
                minutes: 0,
                seconds: 0,
            },
            timeLeft: {
                days: 1,
                hours: 0,
                milliseconds: 0,
                minutes: 0,
                seconds: 0,
            },
            leftOfSpendingPeriod: 1,
            availableBalance: '100',
            nextFoundsBurn: '100',
        })
    })
})
