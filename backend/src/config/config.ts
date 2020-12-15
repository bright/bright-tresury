import { Module, Provider } from "@nestjs/common";
import convict from 'convict'
import * as fs from "fs";
import { memoize } from 'lodash';
import * as path from "path";
import { AuthConfig, authConfigSchema } from "../auth/auth.config";
import { AWSConfig, awsConfigSchema } from "../aws.config";
import { tryLoadParamsFromSSM } from "./config.ssm";
import { DatabaseConfig, databaseConfigSchema, DatabaseConfigToken } from "../database/database.config"
import { getLogger } from "../logging.module";
import { AsyncFactoryProvider, propertyOfProvider } from "../utils/dependency.injection";
import { BlockchainConfig, blockchainConfigSchema, BlockchainConfigToken } from "../blockchain/blockchain.config";

interface EnvConfig {
    deployEnv: "production" | "development" | "development-local" | "stage" | "test" | "test-local"
    port: number
}

export type AppConfig = EnvConfig & {
    auth: AuthConfig
    database: DatabaseConfig,
    aws: AWSConfig,
    // blockchain: BlockchainConfig,
};

const configSchema = convict<AppConfig>({
    deployEnv: {
        doc: "The application environment.",
        format: ["production", "development", "development-local", "stage", "test", "test-local"],
        default: "development",
        env: "DEPLOY_ENV"
    },
    port: {
        doc: "Listen port.",
        format: "port",
        default: 3000,
        env: "PORT"
    },
    auth: authConfigSchema,
    database: databaseConfigSchema,
    aws: awsConfigSchema,
    // blockchain: blockchainConfigSchema,
});
const logger = getLogger();

const loadConfig = memoize(async () => {
    const env: string = configSchema.get('deployEnv');

    const defaultConfig = path.join(process.cwd(), 'config', 'default.json');
    const envConfig = path.join(process.cwd(), 'config', `${env}.json`);
    const files = [defaultConfig, envConfig].filter((configPath) => {
        const exists = fs.existsSync(configPath);
        if (!exists) {
            logger.info(`Config file ${configPath} does not exist`);
        }
        return exists
    });

    configSchema.loadFile(files);

    const parametersFromSSM = await tryLoadParamsFromSSM(configSchema.getProperties().aws, env);

    if (parametersFromSSM) {
        logger.info("Apply parameters fetched from SSM");
        configSchema.load(parametersFromSSM)
    }

    configSchema.validate()

    return configSchema.getProperties()
});

const appConfigProvider: AsyncFactoryProvider<AppConfig> = {
    provide: 'AppConfig',
    useFactory: async () => await loadConfig()
}

const authConfigProvider = propertyOfProvider(appConfigProvider, 'auth', 'AuthConfig');
const databaseConfigProvider = propertyOfProvider(appConfigProvider, "database", DatabaseConfigToken)
// const blockchainConfigProvider = propertyOfProvider(appConfigProvider, "blockchain", BlockchainConfigToken)
const providers: Provider[] = [appConfigProvider, authConfigProvider, databaseConfigProvider];

// @Global() // if we don't have to import config module everywhere
@Module({
    providers,
    exports: providers
})
export class ConfigModule {
}
