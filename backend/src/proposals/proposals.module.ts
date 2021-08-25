import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../auth/session/session.module'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { DatabaseModule } from '../database/database.module'
import { IdeaProposalDetailsModule } from '../idea-proposal-details/idea-proposal-details.module'
import { MilestoneDetailsModule } from '../milestone-details/milestone-details.module'
import { Proposal } from './entities/proposal.entity'
import { ProposalDetailsController } from './proposal-details/proposal-details.controller'
import { ProposalMilestone } from './proposal-milestones/entities/proposal-milestone.entity'
import { ProposalMilestonesController } from './proposal-milestones/proposal-milestones.controller'
import { ProposalMilestonesService } from './proposal-milestones/proposal-milestones.service'
import { ProposalsController } from './proposals.controller'
import { ProposalsService } from './proposals.service'
import { ConfigModule } from '../config/config.module'
import { IsValidNetworkConstraint } from '../utils/network.validator'
import { ProposalDetailsService } from './proposal-details/proposal-details.service'

@Module({
    imports: [
        DatabaseModule,
        ConfigModule,
        BlockchainModule,
        SessionModule,
        IdeaProposalDetailsModule,
        MilestoneDetailsModule,
        TypeOrmModule.forFeature([Proposal, ProposalMilestone]),
    ],
    controllers: [ProposalsController, ProposalMilestonesController, ProposalDetailsController],
    providers: [ProposalsService, IsValidNetworkConstraint, ProposalMilestonesService, ProposalDetailsService],
    exports: [ProposalsService],
})
export class ProposalsModule {}
