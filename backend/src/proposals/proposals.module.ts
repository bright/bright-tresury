import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../auth/session/session.module'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { DatabaseModule } from '../database/database.module'
import { IdeaProposalDetailsModule } from '../idea-proposal-details/idea-proposal-details.module'
import { MilestoneDetailsModule } from '../milestone-details/milestone-details.module'
import { ProposalEntity } from './entities/proposal.entity'
import { ProposalDetailsController } from './proposal-details/proposal-details.controller'
import { ProposalMilestoneEntity } from './proposal-milestones/entities/proposal-milestone.entity'
import { ProposalMilestonesController } from './proposal-milestones/proposal-milestones.controller'
import { ProposalMilestonesService } from './proposal-milestones/proposal-milestones.service'
import { ProposalsController } from './proposals.controller'
import { ProposalsService } from './proposals.service'
import { ConfigModule } from '../config/config.module'
import { IsValidNetworkConstraint } from '../utils/network.validator'
import { ProposalDetailsService } from './proposal-details/proposal-details.service'
import { ProposalCommentsController } from './proposal-comments/proposal-comments.controller'
import { ProposalCommentsService } from './proposal-comments/proposal-comments.service'
import { CommentEntity } from '../comments/comment.entity'
import { ProposalCommentEntity } from './proposal-comments/entities/proposal-comment.entity'

@Module({
    imports: [
        DatabaseModule,
        ConfigModule,
        BlockchainModule,
        SessionModule,
        IdeaProposalDetailsModule,
        MilestoneDetailsModule,
        TypeOrmModule.forFeature([ProposalEntity, ProposalMilestoneEntity, ProposalCommentEntity, CommentEntity]),
    ],
    controllers: [
        ProposalsController,
        ProposalMilestonesController,
        ProposalDetailsController,
        ProposalCommentsController,
    ],
    providers: [
        ProposalsService,
        IsValidNetworkConstraint,
        ProposalMilestonesService,
        ProposalDetailsService,
        ProposalCommentsService,
    ],
    exports: [ProposalsService, ProposalCommentsService],
})
export class ProposalsModule {}
