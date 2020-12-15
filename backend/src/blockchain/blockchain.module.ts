import { Module } from '@nestjs/common'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { ConfigModule } from '../config/config'
import { getLogger } from "../logging.module";
import { BlockchainConfig, BlockchainConfigToken } from './blockchain.config'
import { BlockchainService } from './blockchain.service'

const logger = getLogger()

let polkadotApiInstance: null | ApiPromise

const polkadotApiFactory = {
    provide: 'PolkadotApi',
    useFactory: async (blockchainConfig: BlockchainConfig) => {
        if (polkadotApiInstance === null || polkadotApiInstance === undefined) {
            const wsProvider = new WsProvider(blockchainConfig.nodeUrl);
            polkadotApiInstance = await ApiPromise.create({
                provider: wsProvider,
                types: blockchainConfig.types,
            });
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
export class PolkadotApiModule {
    async onModuleDestroy() {
        logger.info("Polkadot module destroy")
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
