import { INestApplication, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigModule } from './config/config.module'
import { DatabaseModule } from './database/database.module'
import { LoggingModule, NestLoggerAdapter } from './logging.module'
import { IdeasModule } from './ideas/ideas.module'
import { ProposalsModule } from './proposals/proposals.module'
import { AppController } from './app.controller'
import { FrontendMiddleware } from './front-end.middleware'
import { NestExpressApplication } from '@nestjs/platform-express'
import { UsersModule } from './users/users.module'
import { SuperTokensModule } from './auth/supertokens/supertokens.module'
import { AuthModule } from './auth/auth.module'
import supertokens from 'supertokens-node'
import { SuperTokensExceptionFilter } from './auth/supertokens/supertokens.exceptionFilter'
import { initializeSupertokens } from './auth/supertokens/supertokens.config'
import { SuperTokensService } from './auth/supertokens/supertokens.service'
import { EmailsModule } from './emails/emails.module'
import { CachingModule } from './cache/cache.module'

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
}

export async function createApp() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: new NestLoggerAdapter(),
    })

    configureGlobalServices(app)

    return app
}
