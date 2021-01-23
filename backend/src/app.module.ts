import { INestApplication, Module, ValidationPipe, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { ConfigModule } from "./config/config";
import { DatabaseModule } from "./database/database.module";
import { LoggingModule, NestLoggerAdapter } from "./logging.module";
import { VersionModule } from "./version/version";
import { IdeasModule } from './ideas/ideas.module';
import { ProposalsModule } from './proposals/proposals.module';
import { ExtrinsicsModule } from './extrinsics/extrinsics.module';
import {AppController} from "./app.controller";
import { FrontendMiddleware } from './front-end.middleware';
import {NestExpressApplication} from "@nestjs/platform-express";

@Module({
    imports: [
        LoggingModule,
        ConfigModule,
        DatabaseModule,
        VersionModule,
        AuthModule,
        IdeasModule,
        // BlockchainModule,
        ProposalsModule,
        // ExtrinsicsModule,
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
