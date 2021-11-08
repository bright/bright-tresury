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
    constructor(@Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections) {}

    static extractBountyIndex(extrinsicEvents: ExtrinsicEvent[]): number | undefined {
        logger.info('Looking for a bounty proposal index')
        return extractNumberFromBlockchainEvent(extrinsicEvents, 'bounties', 'BountyProposed', 'BountyIndex')
    }

    getBountiesConfig(networkId: string): BountiesBlockchainConfigurationDto {
        const bountiesConsts = getApi(this.blockchainsConnections, networkId).consts.bounties

        const depositBase = bountiesConsts.bountyDepositBase.toString() as NetworkPlanckValue
        const dataDepositPerByte = bountiesConsts.dataDepositPerByte.toString() as NetworkPlanckValue
        const bountyValueMinimum = bountiesConsts.bountyValueMinimum.toString() as NetworkPlanckValue
        const maximumReasonLength = Number(bountiesConsts.maximumReasonLength)
        return {
            depositBase,
            dataDepositPerByte,
            bountyValueMinimum,
            maximumReasonLength,
        }
    }
}
