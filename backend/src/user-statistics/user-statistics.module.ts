import { Module } from '@nestjs/common'
import { BountiesModule } from '../bounties/bounties.module'
import { IdeasModule } from '../ideas/ideas.module'
import { ProposalsModule } from '../proposals/proposals.module'
import { UsersModule } from '../users/users.module'
import { TipsModule } from '../tips/tips.module'
import { UserStatisticsController } from './user-statistics.controller'
import { UserStatisticsService } from './user-statistics.service'
import { SessionModule } from '../auth/session/session.module'

@Module({
    imports: [SessionModule, UsersModule, IdeasModule, ProposalsModule, BountiesModule, TipsModule],
    providers: [UserStatisticsService],
    exports: [UserStatisticsModule],
    controllers: [UserStatisticsController],
})
export class UserStatisticsModule {}
