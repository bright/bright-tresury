import { Injectable } from '@nestjs/common'
import { UserStatisticsDto } from './user-statistics.dto'
import { IdeasService } from '../ideas/ideas.service'
import { ProposalsService } from '../proposals/proposals.service'
import { TimeFrame } from '../utils/time-frame.query'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { BountiesService } from '../bounties/bounties.service'
import { TipsService } from '../tips/tips.service'

@Injectable()
export class UserStatisticsService {
    constructor(
        private readonly ideasService: IdeasService,
        private readonly proposalsService: ProposalsService,
        private readonly bountiesService: BountiesService,
        private readonly tipsService: TipsService,
    ) {}

    async getUserStatistics(networkName: string, userId: string): Promise<UserStatisticsDto> {
        const [ideas, proposals, bounties, tips] = await Promise.all([
            this.ideasService.findIdeasByUserId(networkName, userId),
            this.proposalsService.find(
                networkName,
                { ownerId: userId, timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            ),
            this.bountiesService.find(
                networkName,
                { ownerId: userId, timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            ),
            this.tipsService.find(
                networkName,
                { ownerId: userId, timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            ),
        ])
        return new UserStatisticsDto({
            ideas: ideas.length,
            proposals: proposals.total,
            bounties: bounties.total,
            tips: tips.total,
        })
    }
}
