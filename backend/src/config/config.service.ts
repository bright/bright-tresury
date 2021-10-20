import { Inject, Injectable } from '@nestjs/common'
import { BlockchainConfig, BlockchainConfigToken } from '../blockchain/blockchain.config'
import { BlockchainConfigurationDto } from '../blockchain/dto/blockchain-configuration.dto'

@Injectable()
export class ConfigService {
    constructor(@Inject(BlockchainConfigToken) private readonly blockchainsConfig: BlockchainConfig[]) {}
    getBlockchainsConfiguration() {
        return this.blockchainsConfig.map((blockchainConfig) => new BlockchainConfigurationDto(blockchainConfig))
    }
}
