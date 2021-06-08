import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Connection } from 'typeorm'
import { ConfigModule } from './config/config'
import { DatabaseModule } from './database/database.module'
import { getLogger, NestLoggerAdapter } from './logging.module'

const logger = getLogger()

@Module({
    imports: [ConfigModule, DatabaseModule],
    exports: [],
})
export class AppModule {
    constructor(private readonly connection: Connection) {
        connection
            .runMigrations()
            .then(() => {
                logger.info('done') //
                process.exit()
            })
            .catch((err) => {
                logger.error(err)
                process.exit(1)
            })
    }
}

async function bootstrap() {
    await NestFactory.create(AppModule, {
        logger: new NestLoggerAdapter(logger),
    })
}

bootstrap()
