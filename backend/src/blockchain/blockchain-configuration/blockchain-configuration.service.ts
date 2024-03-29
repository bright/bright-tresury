import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { BlockchainBountiesService } from '../blockchain-bounties/blockchain-bounties.service'
import { BlockchainTipsService } from '../blockchain-tips/blockchain-tips.service'
import { getApi } from '../utils'
import { BlockchainsConnections } from '../blockchain.module'
import { BN_MILLION, BN_HUNDRED } from '@polkadot/util'
import { BlockchainConfig, BlockchainConfigToken } from './blockchain-configuration.config'
import { BlockchainConfigurationDto } from './dto/blockchain-configuration.dto'
import { NetworkPlanckValue } from '../../utils/types'
import { BlockchainChildBountiesService } from '../blockchain-child-bounties/blockchain-child-bounties.service'
import { BlockchainProposalsService } from '../blockchain-proposals/blockchain-proposals.service'

@Injectable()
export class BlockchainConfigurationService {
    private readonly defaultBlockchainConfigMap: { [key: string]: BlockchainConfigurationDto }

    constructor(
        @Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections,
        @Inject(BlockchainConfigToken) private readonly blockchainConfig: BlockchainConfig[],
        private readonly proposalsBlockchainService: BlockchainProposalsService,
        private readonly bountiesBlockchainService: BlockchainBountiesService,
        private readonly tipsBlockchainService: BlockchainTipsService,
        private readonly childBountiesBlockchainService: BlockchainChildBountiesService,
    ) {
        this.defaultBlockchainConfigMap = blockchainConfig.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
    }

    getBlockchainConfiguration(networkId: string): BlockchainConfigurationDto {
        const defaultBlockchainConfig = this.defaultBlockchainConfigMap[networkId]
        if (!defaultBlockchainConfig) throw new BadRequestException('No configuration with given networkId')

        const api = getApi(this.blockchainsConnections, networkId)

        const decimals = api.registry.chainDecimals[0] ?? defaultBlockchainConfig.decimals

        const currency = api.registry.chainTokens[0] ?? defaultBlockchainConfig.currency

        const proposals =
            this.proposalsBlockchainService.getProposalsConfig(networkId) ?? defaultBlockchainConfig.proposals
        const bounties = this.bountiesBlockchainService.getBountiesConfig(networkId) ?? defaultBlockchainConfig.bounties
        const tips = this.tipsBlockchainService.getTipsConfig(networkId) ?? defaultBlockchainConfig.tips
        const childBounties =
            this.childBountiesBlockchainService.getChildBountiesConfig(networkId) ??
            defaultBlockchainConfig.childBounties
        const version = api.consts.system.version.specVersion.toNumber()

        return {
            ...defaultBlockchainConfig,
            decimals,
            currency,
            proposals,
            bounties,
            tips,
            childBounties,
            version,
        }
    }

    getBlockchainsConfigurations(): BlockchainConfigurationDto[] {
        return Object.keys(this.defaultBlockchainConfigMap).map((networkId) =>
            this.getBlockchainConfiguration(networkId),
        )
    }
}
