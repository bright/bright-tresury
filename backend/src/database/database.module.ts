import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { ConfigModule } from '../config/config.module'
import { TypeOrmLoggerAdapater } from '../logging.module'
import { DatabaseConfig, DatabaseConfigToken } from './database.config'
import { join, resolve } from 'path'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { BlockchainConfigurationService } from '../blockchain/blockchain-configuration/blockchain-configuration.service'

const basePath = resolve(join(__dirname, '..', '..'))

export const CoreDatabaseName = 'default'

const coreDatabaseTypeOrmOptions: Partial<PostgresConnectionOptions> = {
    type: 'postgres',
    name: CoreDatabaseName,
    entities: [basePath + '/src/**/*.entity.[tj]s'],
    migrations: [basePath + '/src/database/migration/*.[tj]s'],
    logger: new TypeOrmLoggerAdapater(),
    // synchronize: true
}

const TypeOrmCoreModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [DatabaseConfigToken],
    useFactory(databaseConfig: DatabaseConfig): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            ...coreDatabaseTypeOrmOptions,
            ...databaseConfig,
        }
    },
})

@Module({
    imports: [TypeOrmCoreModule, BlockchainModule],
    providers: [BlockchainConfigurationService]
})
export class DatabaseModule {}
