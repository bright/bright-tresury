import { INestApplication, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { useContainer } from 'class-validator'
import supertokens from 'supertokens-node'
import { AppEventsModule } from './app-events/app-events.module'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { initializeSupertokens } from './auth/supertokens/supertokens.config'
import { SuperTokensExceptionFilter } from './auth/supertokens/supertokens.exceptionFilter'
import { SuperTokensModule } from './auth/supertokens/supertokens.module'
import { SuperTokensService } from './auth/supertokens/supertokens.service'
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
        IdeaProposalDetailsModule,
        MilestoneDetailsModule,
        AppEventsModule,
        UserSettingsModule,
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

    initializeSupertokens(config, app.get(SuperTokensService))

    app.enableCors({
        origin: config.websiteUrl,
        allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
        credentials: true,
    })

    app.use(supertokens.middleware())
    app.use(supertokens.errorHandler())
    app.useGlobalFilters(new SuperTokensExceptionFilter())

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
