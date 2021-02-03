import {Module, OnModuleDestroy} from '@nestjs/common'
import {ApiPromise, WsProvider} from '@polkadot/api'
import {ConfigModule} from '../config/config'
import {getLogger} from "../logging.module";
import {BlockchainConfig, BlockchainConfigToken} from './blockchain.config'
import {BlockchainService} from './blockchain.service'

const logger = getLogger()

let polkadotApiInstance: null | ApiPromise

let onConnectedHandler = () => {
    logger.info(`Connected`)
}

const onReadyHandler = () => {
    logger.info(`ApiPromise ready`)
}

const onErrorHandler = (error: any) => {
    logger.warn(`Cannot connect to substrate node with error ${error}`)
}

const polkadotApiFactory = {
    provide: 'PolkadotApi',
    useFactory: async (blockchainConfig: BlockchainConfig) => {
        if (polkadotApiInstance === null || polkadotApiInstance === undefined) {
            const wsProvider = new WsProvider(blockchainConfig.nodeUrl);

            logger.info(`Connecting to substrate node at ${blockchainConfig.nodeUrl}...`)
            polkadotApiInstance = new ApiPromise({provider: wsProvider, types: blockchainConfig.types});

            onConnectedHandler = () => {
                logger.info(`Connected to substrate node`)
                polkadotApiInstance?.isReady.then(() => {
                    logger.info(`ApiPromise ready`)
                });
            }

            polkadotApiInstance.on('connected', onConnectedHandler);
            polkadotApiInstance.on('ready', onReadyHandler);
            polkadotApiInstance.on('error', onErrorHandler);
        }
        return polkadotApiInstance
    },
    inject: [BlockchainConfigToken],
}

@Module({
    providers: [polkadotApiFactory],
    imports: [ConfigModule],
    exports: ['PolkadotApi'],
})
export class PolkadotApiModule implements OnModuleDestroy {
    async onModuleDestroy() {
        logger.info("Polkadot module destroy")
        polkadotApiInstance?.off('connected', onConnectedHandler)
        polkadotApiInstance?.off('ready', onReadyHandler)
        polkadotApiInstance?.off('error', onErrorHandler)
        polkadotApiInstance?.disconnect()
    }
}

@Module({
    imports: [PolkadotApiModule, ConfigModule],
    providers: [BlockchainService],
    exports: [BlockchainService],
})
export class BlockchainModule {
}
