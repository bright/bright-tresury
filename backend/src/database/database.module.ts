import { Global, Inject, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { ConfigModule } from "../config/config";
import { TypeOrmLoggerAdapater } from "../logging.module";
import { DatabaseConfig, DatabaseConfigToken } from "./database.config";
import { join, resolve } from 'path'

const basePath = resolve(join(__dirname, '..', '..'))

const staticTypeOrmOptions: Partial<PostgresConnectionOptions> = {
    type: "postgres",
    entities: [basePath + "/src/**/*.entity.[tj]s"],
    migrations: [basePath + "/src/database/migration/*.[tj]s"],
    logger: new TypeOrmLoggerAdapater()
    // synchronize: true
}

const TypeOrmCorModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [DatabaseConfigToken],
    useFactory(databaseConfig: DatabaseConfig): TypeOrmModuleOptions {
        return {
            type: "postgres",
            ...staticTypeOrmOptions,
            ...databaseConfig
        }
    }
});

@Module({
    imports: [TypeOrmCorModule]
})
export class DatabaseModule {
}
