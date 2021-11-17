import { Module, OnModuleDestroy } from '@nestjs/common'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { ConfigModule } from '../config/config.module'
import { getLogger } from '../logging.module'
import { BlockchainConfig, BlockchainConfigToken } from './blockchain-configuration/blockchain-configuration.config'
import { BlockchainService } from './blockchain.service'
import { ApiInterfaceEvents } from '@polkadot/api/types'
import { BlockchainConfigurationController } from './blockchain-configuration/blockchain-configuration.controller'
import { BlockchainConfigurationService } from './blockchain-configuration/blockchain-configuration.service'
import { BountiesBlockchainService } from './blockchain-bounties/bounties-blockchain.service'

const logger = getLogger()
export interface BlockchainsConnections {
    [key: string]: BlockchainConnection
}
interface BlockchainConnection {
    apiPromise: ApiPromise
    wsProvider: WsProvider
}
const blockchainsConnections: BlockchainsConnections = {}

const onReadyHandler = (id: string) => {
    logger.info(`${id} ApiPromise ready`)
}

const onErrorHandler = (id: string, error: any) => {
    logger.warn(`Cannot connect to ${id} substrate node with error ${error}`)
}

const onDisconnectedHandler = (id: string, error: any) => {
    logger.warn(`Disconnected from ${id} substrate node`)
}
const onConnectedHandler = (id: string) => {
    logger.info(`Connected to ${id} substrate node`)
    blockchainsConnections[id].apiPromise?.isReady.then(onReadyHandler.bind(null, id))
}

const attachedHandlers: { apiPromise: ApiPromise; type: ApiInterfaceEvents; handler: any }[] = []
const attachEventHandler = (apiPromise: ApiPromise, type: ApiInterfaceEvents, handler: any) => {
    apiPromise.on(type, handler)
    attachedHandlers.push({ apiPromise, type, handler })
}
const removeAllEventHandlers = () => {
    for (const { apiPromise, type, handler } of attachedHandlers) {
        apiPromise.off(type, handler)
    }
}

const attachPolkadotApiEventHandlers = (apiPromise: ApiPromise, id: string) => {
    attachEventHandler(apiPromise, 'connected', onConnectedHandler.bind(null, id))
    attachEventHandler(apiPromise, 'ready', onReadyHandler.bind(null, id))
    attachEventHandler(apiPromise, 'error', onErrorHandler.bind(null, id))
    attachEventHandler(apiPromise, 'disconnected', onDisconnectedHandler.bind(null, id))
}
const polkadotApiFactory = {
    provide: 'PolkadotApi',
    useFactory: async (blockchainsConfig: BlockchainConfig[]) => {
        for (const blockchainConfig of blockchainsConfig) {
            const { id, url, types } = blockchainConfig
            if (!blockchainsConnections[blockchainConfig.id]) {
                logger.info(`Connecting to ${id} substrate node at ${url}...`)
                const wsProvider = new WsProvider(url)
                const apiPromise = new ApiPromise({ provider: wsProvider, types })
                blockchainsConnections[id] = { apiPromise, wsProvider }
                attachPolkadotApiEventHandlers(apiPromise, id)
                try {
                    await apiPromise.isReadyOrError
                } catch (err) {
                    logger.error(err)
                    logger.error(`Error when connecting to ${id} substrate node`)
                }
            }
        }
        return blockchainsConnections
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
        logger.info('PolkadotApi module destroy')
        removeAllEventHandlers()
        logger.info('Removed all blockchains events listeners')
        await Promise.all(
            Object.values(blockchainsConnections).map(({ apiPromise }) =>
                apiPromise.isConnected ? apiPromise.disconnect() : Promise.resolve(null),
            ),
        )
        logger.info('All APIs disconnected')
        await Promise.all(
            Object.values(blockchainsConnections).map(({ wsProvider }) =>
                wsProvider.isConnected ? wsProvider.disconnect : Promise.resolve(null),
            ),
        )
        logger.info('All WebSocket(WS) Providers disconnected')
    }
}

@Module({
    imports: [PolkadotApiModule, ConfigModule],
    controllers: [BlockchainConfigurationController],
    providers: [BlockchainService, BlockchainConfigurationService, BountiesBlockchainService],
    exports: [BlockchainService, BlockchainConfigurationService, BountiesBlockchainService],
})
export class BlockchainModule {}
