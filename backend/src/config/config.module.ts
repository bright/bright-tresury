import { Module, Provider } from '@nestjs/common'
import convict from 'convict'
import * as fs from 'fs'
import { memoize } from 'lodash'
import * as path from 'path'
import { AWSConfig, AWSConfigToken, awsConfigSchema } from '../aws.config'
import { EmailsConfig, emailsConfigSchema, EmailsConfigToken } from '../emails/emails.config'
import { tryLoadParamsFromSSM } from './config.ssm'
import {
    AuthorizationDatabaseConfigToken,
    DatabaseConfig,
    databaseConfigSchema,
    DatabaseConfigToken,
} from '../database/database.config'
import { getLogger } from '../logging.module'
import { AsyncFactoryProvider, propertyOfProvider } from '../utils/dependency.injection'
import { BlockchainConfig, blockchainConfigSchema, BlockchainConfigToken } from '../blockchain/blockchain.config'
import { stringFormat } from './formats/string.format'
import { notEmptyArrayFormat } from './formats/not-empty-array.format'
import { AuthConfig, authConfigSchema, AuthConfigToken } from '../auth/auth.config'
import { ConfigController } from './config.controller'
import { ConfigService } from './config.service'

interface EnvConfig {
    deployEnv: 'production' | 'development' | 'development-local' | 'stage' | 'qa' | 'test' | 'test-local'
    port: number
    appName: string
    apiUrl: string
    websiteUrl: string
}

export type AppConfig = EnvConfig & {
    database: DatabaseConfig
    authorizationDatabase: DatabaseConfig
    aws: AWSConfig
    blockchain: BlockchainConfig[]
    auth: AuthConfig
    emails: EmailsConfig
}

const configSchema = convict<AppConfig>({
    deployEnv: {
        doc: 'The application environment.',
        format: [
            'production',
            'development',
            'development-local',
            'development-docker',
            'stage',
            'qa',
            'test',
            'test-local',
        ],
        default: 'development',
        env: 'DEPLOY_ENV',
    },
    port: {
        doc: 'Listen port.',
        format: 'port',
        default: 3001,
        env: 'PORT',
    },
    appName: {
        doc: 'Name of the app',
        format: stringFormat,
        default: 'Bright Treasury',
        env: 'appName',
    },
    apiUrl: {
        doc: 'Api url',
        format: stringFormat,
        default: 'http://localhost:3001',
        env: 'apiUrl',
    },
    websiteUrl: {
        doc: 'Website url',
        format: stringFormat,
        default: 'http://localhost:3000',
        env: 'websiteUrl',
    },
    database: databaseConfigSchema,
    authorizationDatabase: databaseConfigSchema,
    aws: awsConfigSchema,
    blockchain: {
        format: (blockchainConfigList: BlockchainConfig[]) => {
            notEmptyArrayFormat(blockchainConfigList)
            // For more information on how to validate and use default values see:
            // validate: https://github.com/mozilla/node-convict/issues/238
            // defaults: https://github.com/mozilla/node-convict/issues/367
            const parsedBlockchainConfigList = []
            for (const blockchainConfig of blockchainConfigList) {
                parsedBlockchainConfigList.push(
                    convict(blockchainConfigSchema).load(blockchainConfig).validate().getProperties(),
                )
            }
            configSchema.set('blockchain', parsedBlockchainConfigList)
        },
        default: [],
        children: blockchainConfigSchema,
    },
    auth: authConfigSchema,
    emails: emailsConfigSchema,
})
const logger = getLogger()

const loadConfig = memoize(async () => {
    // @ts-ignore
    const env: string = configSchema.get('deployEnv')

    const defaultConfig = path.join(process.cwd(), 'config', 'default.json')
    const envConfig = path.join(process.cwd(), 'config', `${env}.json`)
    const files = [defaultConfig, envConfig].filter((configPath) => {
        const exists = fs.existsSync(configPath)
        if (!exists) {
            logger.info(`Config file ${configPath} does not exist`)
        }
        return exists
    })

    configSchema.loadFile(files)

    const parametersFromSSM = await tryLoadParamsFromSSM(configSchema.getProperties().aws, env)

    if (parametersFromSSM) {
        logger.info('Apply parameters fetched from SSM')
        configSchema.load(parametersFromSSM)
    }

    configSchema.validate()
    return configSchema.getProperties()
})

export const AppConfigToken = 'AppConfig'

const appConfigProvider: AsyncFactoryProvider<AppConfig> = {
    provide: AppConfigToken,
    useFactory: async () => await loadConfig(),
}

const databaseConfigProvider = propertyOfProvider(appConfigProvider, 'database', DatabaseConfigToken)
const authorizationDatabaseConfigProvider = propertyOfProvider(
    appConfigProvider,
    'authorizationDatabase',
    AuthorizationDatabaseConfigToken,
)
const awsConfigProvider = propertyOfProvider(appConfigProvider, 'aws', AWSConfigToken)
const blockchainConfigProvider = propertyOfProvider(appConfigProvider, 'blockchain', BlockchainConfigToken)
const authConfigProvider = propertyOfProvider(appConfigProvider, 'auth', AuthConfigToken)
const emailsConfigProvider = propertyOfProvider(appConfigProvider, 'emails', EmailsConfigToken)
const providers: Provider[] = [
    appConfigProvider,
    databaseConfigProvider,
    authorizationDatabaseConfigProvider,
    awsConfigProvider,
    blockchainConfigProvider,
    authConfigProvider,
    emailsConfigProvider,
    ConfigService,
]

// @Global() // if we don't have to import config module everywhere
@Module({
    providers,
    controllers: [ConfigController],
    exports: providers,
})
export class ConfigModule {}
