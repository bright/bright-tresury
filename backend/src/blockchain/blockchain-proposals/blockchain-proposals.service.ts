import { Inject, Injectable } from '@nestjs/common'
import { BlockchainsConnections } from '../blockchain.module'
import { BlockchainProposalsConfigurationDto } from './dto/blockchain-proposals-configuration.dto'
import { NetworkPlanckValue } from '../../utils/types'
import { BN_HUNDRED, BN_MILLION } from '@polkadot/util'
import { getApi } from '../utils'
import { getLogger } from '../../logging.module'

const logger = getLogger()

@Injectable()
export class BlockchainProposalsService {
    constructor(@Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections) {}

    getProposalsConfig(networkId: string): BlockchainProposalsConfigurationDto | undefined {
        try {
            const consts = getApi(this.blockchainsConnections, networkId).consts.treasury
            if (!consts) {
                return
            }
            const proposalBondMinimum = consts.proposalBondMinimum.toString() as NetworkPlanckValue
            const proposalBondMaximum = consts.proposalBondMaximum?.toString() as NetworkPlanckValue
            const proposalBond = consts.proposalBond.mul(BN_HUNDRED).div(BN_MILLION).toNumber()

            return { proposalBondMinimum, proposalBondMaximum, proposalBond }
        } catch (err) {
            logger.error('Error while fetching treasury proposals configuration', err)
        }
    }
}
