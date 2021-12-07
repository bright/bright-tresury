import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../auth/session/session.module'
import { SuperTokensModule } from '../auth/supertokens/supertokens.module'
import { BountiesModule } from '../bounties/bounties.module'
import { ConfigModule } from '../config/config.module'
import { DatabaseModule } from '../database/database.module'
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

@Module({
    imports: [
        DatabaseModule,
        EmailsModule,
        UsersModule,
        TypeOrmModule.forFeature([AppEventEntity, AppEventReceiverEntity]),
        SuperTokensModule,
        IdeasModule,
        ProposalsModule,
        BountiesModule,
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
    ],
    exports: [AppEventsService],
    controllers: [AppEventsController],
})
export class AppEventsModule {}
