import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth";
import { ConfigModule } from "./config/config";
import { DatabaseModule } from "./database/database.module";
import { LoggingModule, NestLoggerAdapter } from "./logging.module";
import { VersionModule } from "./version/version";
import { ProposalsModule } from './proposals/proposals.module';

@Module({
    imports: [
        LoggingModule,
        ConfigModule,
        DatabaseModule,
        VersionModule,
        AuthModule,
        ProposalsModule
    ],
    exports: []
})
export class AppModule {
}

export function configureGlobalServices(app: INestApplication) {
    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }))
}

export async function createApp() {
    const app = await NestFactory.create(AppModule, {
        logger: new NestLoggerAdapter()
    });

    configureGlobalServices(app);

    return app;
}
