import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../auth/session/session.module'
import { SuperTokensModule } from '../auth/supertokens/supertokens.module'
import { BountiesModule } from '../bounties/bounties.module'
import { ConfigModule } from '../config/config.module'
import { DatabaseModule } from '../database/database.module'
import { DiscussionsModule } from '../discussions/discussions.module'
import { EmailsModule } from '../emails/emails.module'
import { IdeasModule } from '../ideas/ideas.module'
import { ProposalsModule } from '../proposals/proposals.module'
import { UsersModule } from '../users/users.module'
import { AppEventNotificationsService } from './app-event-notifications/app-event-notifications.service'
import { EmailNotificationsService } from './app-event-notifications/email-notifications/email-notifications.service'
import { BountyCommentSubscriber } from './app-event-types/bounty-comment/bounty-comment.subscriber'
import { IdeaCommentSubscriber } from './app-event-types/idea-comment/idea-comment.subscriber'
import { ProposalCommentSubscriber } from './app-event-types/proposal-comment/proposal-comment.subscriber'
import { AppEventsService } from './app-events.service'
import { AppEventReceiverEntity } from './entities/app-event-receiver.entity'
import { AppEventEntity } from './entities/app-event.entity'
import { AppEventSubscriber } from './subscribers/app-event.subscriber'
import { AppEventsController } from './app-events.controller'
import { TipCommentSubscriber } from './app-event-types/tip-comment/tip-comment.subscriber'
import { TipsModule } from '../tips/tips.module'
import { ChildBountyCommentSubscriber } from './app-event-types/childBounty-comment/childBounty-comment.subscriber'

@Module({
    imports: [
        DatabaseModule,
        EmailsModule,
        UsersModule,
        TypeOrmModule.forFeature([AppEventEntity, AppEventReceiverEntity]),
        SuperTokensModule,
        DiscussionsModule,
        IdeasModule,
        ProposalsModule,
        BountiesModule,
        TipsModule,
        ConfigModule,
        SessionModule,
    ],
    providers: [
        AppEventsService,
        AppEventSubscriber,
        AppEventNotificationsService,
        EmailNotificationsService,
        IdeaCommentSubscriber,
        ProposalCommentSubscriber,
        BountyCommentSubscriber,
        ChildBountyCommentSubscriber,
        TipCommentSubscriber,
    ],
    exports: [AppEventsService],
    controllers: [AppEventsController],
})
export class AppEventsModule {}
