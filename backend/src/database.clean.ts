import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Connection, getConnection } from 'typeorm'
import { ConfigModule } from './config/config.module'
import {
    AuthorizationDatabaseName,
    TypeOrmAuthorizationModule,
} from './database/authorization/authorization.database.module'
import { CoreDatabaseName, DatabaseModule } from './database/database.module'
import { getLogger, NestLoggerAdapter } from './logging.module'

const logger = getLogger()

async function getTables(connection: Connection) {
    const tables = await connection.query(
        `
        select *
        from information_schema.tables
        where
            table_schema='public' and table_name != 'migrations' and table_name != 'key_value'
        `,
    )
    return tables.map((t: any) => `"${t.table_name}"`).join(', ')
}

async function cleanDatabase(dbName: string): Promise<void> {
    logger.info(`Started cleaning ${process.env.DEPLOY_ENV} ${dbName} database`)

    const connection = getConnection(dbName)

    const tables = await getTables(connection)
    if (!tables || tables.length === 0) {
        logger.info(`No tables to clean in ${dbName} database`)
    }
    logger.info('Will remove data from tables ', tables)

    const truncateQuery = `truncate ${tables};`
    await connection.query(truncateQuery)
    logger.info(`Cleaning of database ${dbName} done`)
}

async function cleanDatabases() {
    await cleanDatabase(CoreDatabaseName)
    await cleanDatabase(AuthorizationDatabaseName)
}

@Module({
    imports: [ConfigModule, DatabaseModule, TypeOrmAuthorizationModule],
    exports: [],
})
// @ts-ignore
export class AppModule {
    constructor(private readonly connection: Connection) {
        const allowedEnvs = ['stage', 'qa']
        if (!process.env.DEPLOY_ENV || !allowedEnvs.includes(process.env.DEPLOY_ENV)) {
            logger.info(`Trying to clean not stage or qa database. Denied on ${process.env.DEPLOY_ENV}.`)
            process.exit()
        }

        cleanDatabases()
            .then(() => {
                process.exit()
            })
            .catch((error) => {
                logger.error(error)
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
