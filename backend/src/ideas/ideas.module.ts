import { Module } from '@nestjs/common'
import { SessionModule } from '../auth/session/session.module'
import { ExtrinsicsModule } from '../extrinsics/extrinsics.module'
import { IdeaProposalDetailsModule } from '../idea-proposal-details/idea-proposal-details.module'
import { MilestoneDetailsModule } from '../milestone-details/milestone-details.module'
import { ProposalsModule } from '../proposals/proposals.module'
import { IdeaMilestonesRepository } from './idea-milestones/idea-milestones.repository'
import { IdeaProposalsController } from './idea-proposals/idea-proposals.controller'
import { IdeaProposalsService } from './idea-proposals/idea-proposals.service'
import { IdeasController } from './ideas.controller'
import { DatabaseModule } from '../database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Idea } from './entities/idea.entity'
import { IdeasService } from './ideas.service'
import { IdeaNetwork } from './entities/idea-network.entity'
import { IdeaMilestoneNetwork } from './idea-milestones/entities/idea-milestone-network.entity'
import { IdeaMilestonesController } from './idea-milestones/idea-milestones.controller'
import { IdeaMilestonesService } from './idea-milestones/idea-milestones.service'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { IdeaMilestoneProposalsService } from './idea-milestones/idea-milestone-proposals/idea-milestone-proposals.service'
import { IdeaMilestoneProposalsController } from './idea-milestones/idea-milestone-proposals/idea-milestone-proposals.controller'
import { ConfigModule } from '../config/config.module'
import { IsValidNetworkConstraint } from '../utils/network.validator'

@Module({
    imports: [
        DatabaseModule,
        ExtrinsicsModule,
        SessionModule,
        BlockchainModule,
        IdeaProposalDetailsModule,
        MilestoneDetailsModule,
        ConfigModule,
        ProposalsModule,
        TypeOrmModule.forFeature([Idea, IdeaNetwork, IdeaMilestonesRepository, IdeaMilestoneNetwork]),
    ],
    providers: [IdeasService, IdeaProposalsService, IdeaMilestonesService, IdeaMilestoneProposalsService, IsValidNetworkConstraint],
    controllers: [IdeasController, IdeaMilestonesController, IdeaMilestoneProposalsController, IdeaProposalsController],
    exports: [IdeasService, IdeaMilestonesService],
})
export class IdeasModule {}
