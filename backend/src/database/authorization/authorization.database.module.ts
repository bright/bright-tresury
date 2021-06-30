import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { TypeOrmLoggerAdapater } from '../../logging.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '../../config/config.module'
import { AuthorizationDatabaseConfigToken, DatabaseConfig } from '../database.config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface'

export const AuthorizationDatabaseName = 'authorization'

const authorizationDatabaseStaticTypeOrmOptions: Partial<PostgresConnectionOptions> = {
    type: 'postgres',
    name: AuthorizationDatabaseName,
    entities: [],
    migrations: [],
    logger: new TypeOrmLoggerAdapater(),
}

export const TypeOrmAuthorizationModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [AuthorizationDatabaseConfigToken],
    useFactory(databaseConfig: DatabaseConfig): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            ...authorizationDatabaseStaticTypeOrmOptions,
            ...databaseConfig,
        }
    },
})
