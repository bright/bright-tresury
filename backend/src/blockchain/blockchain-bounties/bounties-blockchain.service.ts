import { Inject, Injectable } from '@nestjs/common'
import { ExtrinsicEvent } from '../../extrinsics/extrinsicEvent'
import { getLogger } from '../../logging.module'
import { NetworkPlanckValue } from '../../utils/types'
import { BlockchainConfig, BlockchainConfigToken } from '../blockchain-configuration/blockchain-configuration.config'
import { BlockchainsConnections } from '../blockchain.module'
import { extractNumberFromBlockchainEvent, getApi } from '../utils'
import { BlockchainBountiesConfigurationDto } from './dto/blockchain-bounties-configuration.dto'
import { BlockchainBountyDto, BlockchainBountyStatus } from './dto/blockchain-bounty.dto'
import { BlockchainService } from '../blockchain.service'
import { toBlockchainAccountInfo } from '../dto/blockchain-account-info.dto'
import { PalletBountiesBountyStatus } from '@polkadot/types/lookup'
import { BountiesService } from '../../bounties/bounties.service'
import { DeriveBounties } from '@polkadot/api-derive/types'
import { BlockNumber } from '@polkadot/types/interfaces'
import BN from 'bn.js'
import { extractTime } from '@polkadot/util'

const logger = getLogger()

@Injectable()
export class BountiesBlockchainService {
    constructor(@Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections,
                private readonly blockchainService: BlockchainService) {}

    static extractBountyIndex(extrinsicEvents: ExtrinsicEvent[]): number | undefined {
        logger.info('Looking for a bounty proposal index')
        return extractNumberFromBlockchainEvent(extrinsicEvents, 'bounties', 'BountyProposed', 'BountyIndex')
    }

    getBountiesConfig(networkId: string): BlockchainBountiesConfigurationDto {
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
    async getBounties(networkId: string): Promise<BlockchainBountyDto[]> {
        const api = getApi(this.blockchainsConnections, networkId)
        const bestNumber = await api.derive.chain.bestNumber() // current block number
        const blockTime = this.blockchainService.getBlockTime(networkId) // time for processing one block
        const bountiesDerived = await api.derive.bounties.bounties() // blockchain-bounties currently hold in blockchain

        const proposersAddresses = BountiesBlockchainService.getProposersAddresses(bountiesDerived) // all proposers addresses
        const curatorsAddresses = BountiesBlockchainService.getCuratorsAddresses(bountiesDerived) // all curators addresses (if exists)
        const beneficiariesAddresses = BountiesBlockchainService.getBeneficiariesAddresses(bountiesDerived) // all beneficiaries addresses (if exists)

        const identities = await this.blockchainService.getIdentities(networkId, [
            ...proposersAddresses, ...curatorsAddresses, ...beneficiariesAddresses
        ]) // fetch proposers, curators and beneficiaries identities

        return bountiesDerived.map(({index, description, bounty}) => {
            const proposerAddress = bounty.proposer.toString()
            const {status, data: bountyStatusData } = BountiesBlockchainService.getBountyStatusData(bounty.status)!
            const {curator, updateDue, unlockAt, beneficiary} = bountyStatusData ?? {}
            const curatorAddress = curator?.toString()
            const beneficiaryAddress = beneficiary?.toString()
            return new BlockchainBountyDto({
                index: Number(index.toString()),
                description,
                proposer: toBlockchainAccountInfo(proposerAddress, identities.get(proposerAddress)),
                value: bounty.value.toString() as NetworkPlanckValue,
                fee: bounty.fee.toString() as NetworkPlanckValue,
                curator: curator ? toBlockchainAccountInfo(curatorAddress, identities.get(curatorAddress)): undefined,
                updateDue: BountiesBlockchainService.getBlockchainTimeLeft(bestNumber, updateDue, blockTime),
                beneficiary: beneficiary ? toBlockchainAccountInfo(beneficiaryAddress, identities.get(beneficiaryAddress)): undefined,
                unlockAt: BountiesBlockchainService.getBlockchainTimeLeft(bestNumber, unlockAt, blockTime),
                curatorDeposit: bounty.curatorDeposit.toString() as NetworkPlanckValue,
                bond: bounty.bond.toString() as NetworkPlanckValue,
                status: status!
            })

        })
    }
    private static getBlockchainTimeLeft(currentBlock: BlockNumber, futureBlock: BlockNumber, blockTime: BN) {
        if(!futureBlock || futureBlock.cmp(currentBlock) !== 1)
            return
        const blocksLeft = futureBlock.sub(currentBlock)
        return extractTime(Math.abs(blocksLeft.mul(blockTime).toNumber()))

    }
    private static getProposersAddresses(bountiesDerived: DeriveBounties): string[] {
        return bountiesDerived.map(bountyDerived => bountyDerived.bounty.proposer.toString())
    }

    private static getCuratorsAddresses(bountiesDerived: DeriveBounties): string[] {
        return bountiesDerived.map(({bounty}) => {
            const { data } = BountiesBlockchainService.getBountyStatusData(bounty.status) || {}
            return data?.curator?.toString()
        }).filter(curator => curator !== undefined)
    }

    private static getBeneficiariesAddresses(bountiesDerived: DeriveBounties): string[] {
        return bountiesDerived.map(({bounty}) => {
            const { data } = BountiesBlockchainService.getBountyStatusData(bounty.status) || {}
            return data?.beneficiary?.toString()
        }).filter(beneficiary => beneficiary !== undefined)
    }

    private static getBountyStatusData(bountyStatus: PalletBountiesBountyStatus): {status: BlockchainBountyStatus, data?: any} | null{
        const proposed = bountyStatus.isProposed ? { status: BlockchainBountyStatus.Proposed } : null
        const approved = bountyStatus.isApproved ? { status: BlockchainBountyStatus.Approved } : null
        const funded = bountyStatus.isFunded ? { status: BlockchainBountyStatus.Funded } : null
        const curatorProposed = bountyStatus.isCuratorProposed ? { status: BlockchainBountyStatus.CuratorProposed, data: bountyStatus.asCuratorProposed } : null
        const active = bountyStatus.isActive ? { status: BlockchainBountyStatus.Active, data: bountyStatus.asActive } : null
        const pendingPayout = bountyStatus.isPendingPayout ? { status: BlockchainBountyStatus.PendingPayout, data: bountyStatus.asPendingPayout } : null
        return proposed ?? approved ?? funded ?? curatorProposed ?? active ?? pendingPayout
    }
}
