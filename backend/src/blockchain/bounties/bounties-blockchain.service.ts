import { Inject, Injectable } from '@nestjs/common'
import { ExtrinsicEvent } from '../../extrinsics/extrinsicEvent'
import { getLogger } from '../../logging.module'
import { NetworkPlanckValue } from '../../utils/types'
import { BlockchainConfig, BlockchainConfigToken } from '../blockchain-configuration/blockchain-configuration.config'
import { BlockchainsConnections } from '../blockchain.module'
import { extractNumberFromBlockchainEvent, getApi } from '../utils'
import { BountiesBlockchainConfigurationDto } from './dto/bounties-blockchain-configuration.dto'

const logger = getLogger()

@Injectable()
export class BountiesBlockchainService {
    constructor(
        @Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections,
        @Inject(BlockchainConfigToken) private readonly blockchainsConfiguration: BlockchainConfig[],
    ) {}

    static extractBountyIndex(extrinsicEvents: ExtrinsicEvent[]): number | undefined {
        logger.info('Looking for a bounty proposal index')
        return extractNumberFromBlockchainEvent(extrinsicEvents, 'bounties', 'BountyProposed', 'BountyIndex')
    }

    getBountiesConfig(networkId: string): BountiesBlockchainConfigurationDto {
        const api = getApi(this.blockchainsConnections, networkId)
        const depositBase = api.consts.bounties.bountyDepositBase.toString() as NetworkPlanckValue
        const dataDepositPerByte = api.consts.bounties.dataDepositPerByte.toString() as NetworkPlanckValue
        return {
            depositBase,
            dataDepositPerByte,
        }
    }
}
