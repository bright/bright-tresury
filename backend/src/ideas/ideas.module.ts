import { Module } from '@nestjs/common'
import { SessionModule } from '../auth/session/session.module'
import { ExtrinsicsModule } from '../extrinsics/extrinsics.module'
import { IdeaProposalDetailsModule } from '../idea-proposal-details/idea-proposal-details.module'
import { MilestoneDetailsModule } from '../milestone-details/milestone-details.module'
import { ProposalsModule } from '../proposals/proposals.module'
import { IdeaMilestoneNetworksController } from './idea-milestones/idea-milestone-networks/idea-milestone-networks.controller'
import { IdeaMilestoneNetworksService } from './idea-milestones/idea-milestone-networks/idea-milestone-networks.service'
import { IdeaMilestonesRepository } from './idea-milestones/idea-milestones.repository'
import { IdeaProposalsController } from './idea-proposals/idea-proposals.controller'
import { IdeaProposalsService } from './idea-proposals/idea-proposals.service'
import { IdeasController } from './ideas.controller'
import { DatabaseModule } from '../database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IdeaEntity } from './entities/idea.entity'
import { IdeasService } from './ideas.service'
import { IdeaNetworkEntity } from './entities/idea-network.entity'
import { IdeaMilestoneNetworkEntity } from './idea-milestones/entities/idea-milestone-network.entity'
import { IdeaMilestonesController } from './idea-milestones/idea-milestones.controller'
import { IdeaMilestonesService } from './idea-milestones/idea-milestones.service'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { IdeaMilestoneProposalsService } from './idea-milestones/idea-milestone-proposals/idea-milestone-proposals.service'
import { IdeaMilestoneProposalsController } from './idea-milestones/idea-milestone-proposals/idea-milestone-proposals.controller'
import { ConfigModule } from '../config/config.module'
import { IsValidNetworkConstraint } from '../utils/network.validator'
import { IdeaNetworksService } from './idea-networks/idea-networks.service'
import { IdeaNetworksController } from './idea-networks/idea-networks.controller'
import { UsersModule } from '../users/users.module'

@Module({
    imports: [
        DatabaseModule,
        ExtrinsicsModule,
        SessionModule,
        BlockchainModule,
        IdeaProposalDetailsModule,
        MilestoneDetailsModule,
        ConfigModule,
        UsersModule,
        ProposalsModule,
        TypeOrmModule.forFeature([IdeaEntity, IdeaNetworkEntity, IdeaMilestonesRepository, IdeaMilestoneNetworkEntity]),
    ],
    providers: [
        IdeasService,
        IdeaProposalsService,
        IdeaMilestonesService,
        IdeaMilestoneNetworksService,
        IdeaMilestoneProposalsService,
        IsValidNetworkConstraint,
        IdeaNetworksService,
    ],
    controllers: [
        IdeasController,
        IdeaMilestonesController,
        IdeaMilestoneNetworksController,
        IdeaMilestoneProposalsController,
        IdeaProposalsController,
        IdeaNetworksController,
    ],
    exports: [IdeasService, IdeaMilestonesService],
})
export class IdeasModule {}
