import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { UserStatisticsService } from './user-statistics.service'
import { IdeasService } from '../ideas/ideas.service'
import { BountiesService } from '../bounties/bounties.service'
import { TimeFrame } from '../utils/time-frame.query'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { ProposalsService } from '../proposals/proposals.service'
import { TipsService } from '../tips/tips.service'

describe('UserStatisticsService', () => {
    const app = beforeSetupFullApp()
    const service = beforeAllSetup(() => app().get<UserStatisticsService>(UserStatisticsService))
    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })
    describe('getUserStatistics', () => {
        it('should call IdeasService.findUserIdeas', async () => {
            const spy = jest.spyOn(app().get<IdeasService>(IdeasService), 'findIdeasByUserId')
            await service().getUserStatistics(NETWORKS.POLKADOT, '6efe1d8d-f463-4a87-a482-3eade8f9af95')
            expect(spy).toHaveBeenCalledWith(NETWORKS.POLKADOT, '6efe1d8d-f463-4a87-a482-3eade8f9af95')
        })

        it('should call BountiesService.find', async () => {
            const spy = jest.spyOn(app().get<BountiesService>(BountiesService), 'find')
            await service().getUserStatistics(NETWORKS.POLKADOT, '6efe1d8d-f463-4a87-a482-3eade8f9af95')
            expect(spy).toHaveBeenCalledWith(
                NETWORKS.POLKADOT,
                { ownerId: '6efe1d8d-f463-4a87-a482-3eade8f9af95', timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
        })
        it('should call ProposalsService.find', async () => {
            const spy = jest.spyOn(app().get<ProposalsService>(ProposalsService), 'find')
            await service().getUserStatistics(NETWORKS.POLKADOT, '6efe1d8d-f463-4a87-a482-3eade8f9af95')
            expect(spy).toHaveBeenCalledWith(
                NETWORKS.POLKADOT,
                { ownerId: '6efe1d8d-f463-4a87-a482-3eade8f9af95', timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
        })
        it('should call TipsService.find', async () => {
            const spy = jest.spyOn(app().get<TipsService>(TipsService), 'find')
            await service().getUserStatistics(NETWORKS.POLKADOT, '6efe1d8d-f463-4a87-a482-3eade8f9af95')
            expect(spy).toHaveBeenCalledWith(
                NETWORKS.POLKADOT,
                { ownerId: '6efe1d8d-f463-4a87-a482-3eade8f9af95', timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
        })

        it('should return stats dto', async () => {
            const received = await service().getUserStatistics(
                NETWORKS.POLKADOT,
                '6efe1d8d-f463-4a87-a482-3eade8f9af95',
            )
            expect(received).toMatchObject({
                ideas: 0,
                proposals: 0,
                bounties: 0,
                tips: 0,
            })
        })
    })
})
