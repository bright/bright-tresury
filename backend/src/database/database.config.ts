import { Schema, SchemaObj } from "convict"
import { LoggerOptions } from "typeorm/logger/LoggerOptions";

export interface DatabaseConfig {
    host: string
    port: number
    username: string
    password: string | undefined
    database: string
    retryAttempts?: number
    retryDelay?: number
    keepConnectionAlive?: boolean
    logging: LoggerOptions
}

export const DatabaseConfigToken = 'DatabaseConfig'

export const databaseConfigSchema: Schema<DatabaseConfig> = {
    host: {
        doc: "Database connection hostname",
        default: "localhost",
        env: "DATABASE_HOST",
        format(value: any) {
            if (typeof value !== "string") {
                throw new Error("must be a string")
            }
        }
    } as SchemaObj<string>,

    port: {
        doc: "Database connection port",
        default: 5432,
        format(value: any) {
            if (typeof value !== "number") {
                throw new Error("must be a number")
            }

            if (value < 1 || value > 65535) {
                throw new Error("must be in range from 1 to 65535")
            }
        }
    } as SchemaObj<number>,

    username: {
        doc: "Username used to connect to database",
        default: "treasury",
        env: "DATABASE_USERNAME",
        format(value: any) {
            if (typeof value !== "string") {
                throw new Error("must be a string")
            }
        }
    } as SchemaObj<string>,

    password: {
        doc: "Password used to connect to database",
        default: undefined,
        sensitive: true,
        env: "DATABASE_PASSWORD",
        format(value: string | undefined) {
            if (!value) {
                return;
            }
            // noinspection SuspiciousTypeOfGuard
            if (typeof value !== "string") {
                throw new Error("must be a string")
            }
        }
    } as SchemaObj<string | undefined>,

    database: {
        doc: "Database name used to connect to database",
        default: "treasury",
        format(value: any) {
            if (typeof value !== "string") {
                throw new Error("must be a string")
            }
        }
    } as SchemaObj<string>,

    logging: {
        doc: "Logging in typeorm https://github.com/typeorm/typeorm/blob/master/docs/logging.md",
        default: ['query', 'error'],
        format(value: any) {
            if (Array.isArray(value)) {
                return value;
            }
            if (typeof value !== "string") {
                throw new Error("must be a string")
            }
            if (value === 'true') {
                return true
            }
            if (value === 'false') {
                return false;
            }
            return value.split(',');
        }
    } as SchemaObj<LoggerOptions>
}
