import { INestApplication, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { useContainer } from 'class-validator'
import supertokens from 'supertokens-node'
import { AppEventsModule } from './app-events/app-events.module'
import { AppController } from './app.controller'
import { SupertokensExceptionFilter } from './auth/auth.filter'
import { AuthModule } from './auth/auth.module'
import { SuperTokensModule } from './auth/supertokens/supertokens.module'
import { BlockchainModule } from './blockchain/blockchain.module'
import { CachingModule } from './cache/cache.module'
import { ConfigModule } from './config/config.module'
import { DatabaseModule } from './database/database.module'
import { EmailsModule } from './emails/emails.module'
import { FrontendMiddleware } from './front-end.middleware'
import { IdeaProposalDetailsModule } from './idea-proposal-details/idea-proposal-details.module'
import { IdeasModule } from './ideas/ideas.module'
import { LoggingModule, NestLoggerAdapter } from './logging.module'
import { MilestoneDetailsModule } from './milestone-details/milestone-details.module'
import { ProposalsModule } from './proposals/proposals.module'
import { StatsModule } from './stats/stats.module'
import { UserSettingsModule } from './users/user-settings/user-settings.module'
import { UsersModule } from './users/users.module'
import { BountiesModule } from './bounties/bounties.module'
import { PolkassemblyModule } from './polkassembly/polkassembly.module'

@Module({
    imports: [
        LoggingModule,
        ConfigModule,
        DatabaseModule,
        IdeasModule,
        ProposalsModule,
        SuperTokensModule,
        UsersModule,
        AuthModule,
        EmailsModule,
        CachingModule,
        StatsModule,
        PolkassemblyModule,
        IdeaProposalDetailsModule,
        MilestoneDetailsModule,
        AppEventsModule,
        UserSettingsModule,
        BountiesModule,
        BlockchainModule,
    ],
    exports: [],
    controllers: [AppController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(FrontendMiddleware).exclude('api/(.*)').forRoutes('/**')
    }
}

export function configureGlobalServices(app: INestApplication) {
    const config = app.get('AppConfig')

    app.enableCors({
        origin: config.websiteUrl,
        allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
        credentials: true,
    })

    app.useGlobalFilters(new SupertokensExceptionFilter())

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    )
    useContainer(app.select(AppModule), { fallbackOnErrors: true })
}

export async function createApp() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: new NestLoggerAdapter(),
    })

    configureGlobalServices(app)

    return app
}
