import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { BountiesBlockchainService } from '../blockchain-bounties/bounties-blockchain.service'
import { getApi } from '../utils'
import { BlockchainsConnections } from '../blockchain.module'
import { BN_MILLION, BN_HUNDRED } from '@polkadot/util'
import { BlockchainConfig, BlockchainConfigToken } from './blockchain-configuration.config'
import { BlockchainConfigurationDto } from './dto/blockchain-configuration.dto'
import { NetworkPlanckValue } from '../../utils/types'

@Injectable()
export class BlockchainConfigurationService {
    private readonly defaultBlockchainConfigMap: { [key: string]: BlockchainConfigurationDto }

    constructor(
        @Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections,
        @Inject(BlockchainConfigToken) private readonly blockchainConfig: BlockchainConfig[],
        private readonly bountiesBlockchainService: BountiesBlockchainService,
    ) {
        this.defaultBlockchainConfigMap = blockchainConfig.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
    }

    getBlockchainConfiguration(networkId: string): BlockchainConfigurationDto {
        const defaultBlockchainConfig = this.defaultBlockchainConfigMap[networkId]
        if (!defaultBlockchainConfig) throw new BadRequestException('No configuration with given networkId')

        const api = getApi(this.blockchainsConnections, networkId)

        const decimals = api.registry.chainDecimals[0] ?? defaultBlockchainConfig.decimals

        const currency = api.registry.chainTokens[0] ?? defaultBlockchainConfig.currency

        const proposalBondMinimum = api.consts.treasury.proposalBondMinimum.toString() as NetworkPlanckValue
        const minValue = proposalBondMinimum ?? defaultBlockchainConfig.bond.minValue

        const proposalBond = api.consts.treasury.proposalBond.mul(BN_HUNDRED).div(BN_MILLION).toNumber()
        const percentage = proposalBond ?? defaultBlockchainConfig.bond.percentage

        const bounties = this.bountiesBlockchainService.getBountiesConfig(networkId)

        return {
            ...defaultBlockchainConfig,
            decimals,
            currency,
            bond: { minValue, percentage },
            bounties,
        }
    }

    getBlockchainsConfigurations(): BlockchainConfigurationDto[] {
        return Object.keys(this.defaultBlockchainConfigMap).map((networkId) =>
            this.getBlockchainConfiguration(networkId),
        )
    }
}
