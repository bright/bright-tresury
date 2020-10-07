import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config'
import { BlockchainService } from './blockchain.service'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { BlockchainConfig, BlockchainConfigToken } from './blockchain.config'

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
export class PolkadotApiModule {}

@Module({
  imports: [PolkadotApiModule, ConfigModule],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule { }
