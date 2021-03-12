import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmModuleOptions} from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import {ConfigModule} from "../config/config";
import {TypeOrmLoggerAdapater} from "../logging.module";
import {AuthorizationDatabaseConfigToken, DatabaseConfig, DatabaseConfigToken} from "./database.config";
import {join, resolve} from 'path'

const basePath = resolve(join(__dirname, '..', '..'))

export const CoreDatabaseName = 'default'

const coreDatabaseTypeOrmOptions: Partial<PostgresConnectionOptions> = {
    type: "postgres",
    name: CoreDatabaseName,
    entities: [basePath + "/src/**/*.entity.[tj]s"],
    migrations: [basePath + "/src/database/migration/*.[tj]s"],
    logger: new TypeOrmLoggerAdapater()
    // synchronize: true
}

const TypeOrmCoreModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [DatabaseConfigToken],
    useFactory(databaseConfig: DatabaseConfig): TypeOrmModuleOptions {
        return {
            type: "postgres",
            ...coreDatabaseTypeOrmOptions,
            ...databaseConfig
        }
    }
});

export const AuthorizationDatabaseName = 'authorization'

const authorizationDatabaseStaticTypeOrmOptions: Partial<PostgresConnectionOptions> = {
    type: "postgres",
    name: AuthorizationDatabaseName,
    entities: [],
    migrations: [],
    logger: new TypeOrmLoggerAdapater()
}

const TypeOrmAuthorizationModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [AuthorizationDatabaseConfigToken],
    useFactory(databaseConfig: DatabaseConfig): TypeOrmModuleOptions {
        return {
            type: "postgres",
            ...authorizationDatabaseStaticTypeOrmOptions,
            ...databaseConfig
        }
    }
});

@Module({
    imports: [TypeOrmCoreModule, TypeOrmAuthorizationModule]
})
export class DatabaseModule {
}
