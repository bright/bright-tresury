import {INestApplication, MiddlewareConsumer, Module, NestModule, ValidationPipe} from '@nestjs/common';
import {NestFactory} from "@nestjs/core";
import {ConfigModule} from "./config/config";
import {DatabaseModule} from "./database/database.module";
import {LoggingModule, NestLoggerAdapter} from "./logging.module";
import {IdeasModule} from './ideas/ideas.module';
import {ProposalsModule} from './proposals/proposals.module';
import {AppController} from "./app.controller";
import {FrontendMiddleware} from './front-end.middleware';
import {NestExpressApplication} from "@nestjs/platform-express";
import {UsersModule} from "./users/users.module";
import {SuperTokensModule} from "./auth/supertokens/supertokens.module";
import {AuthModule} from "./auth/auth.module";
import supertokens from "supertokens-node";
import {SuperTokensExceptionFilter} from "./auth/supertokens/supertokens.exceptionFilter";
import {baseApiPath} from "./main";
import {initializeSupertokens} from "./auth/supertokens/supertokens.config";
import {SuperTokensService} from "./auth/supertokens/supertokens.service";

@Module({
    imports: [
        LoggingModule,
        ConfigModule,
        DatabaseModule,
        IdeasModule,
        // BlockchainModule,
        ProposalsModule,
        // ExtrinsicsModule,
        SuperTokensModule,
        UsersModule,
        AuthModule
    ],
    exports: [],
    controllers: [AppController]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(FrontendMiddleware).forRoutes('*')
    }
}

export function configureGlobalServices(app: INestApplication) {
    const config = app.get('AppConfig')

    app.setGlobalPrefix(baseApiPath);

    initializeSupertokens(config, app.get(SuperTokensService))

    app.enableCors({
        origin: config.websiteUrl,
        allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
        credentials: true,
    })

    app.use(supertokens.middleware());
    app.use(supertokens.errorHandler())
    app.useGlobalFilters(new SuperTokensExceptionFilter())

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true
        })
    )
}

export async function createApp() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: new NestLoggerAdapter(),
    })
    // app.use(timeout('30s'))

    configureGlobalServices(app)

    return app
}
