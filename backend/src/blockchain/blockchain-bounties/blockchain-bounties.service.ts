import { Inject, Injectable } from '@nestjs/common'
import { ExtrinsicEvent } from '../../extrinsics/extrinsicEvent'
import { getLogger } from '../../logging.module'
import { NetworkPlanckValue, Nil } from '../../utils/types'
import { BlockchainsConnections } from '../blockchain.module'
import { extractNumberFromBlockchainEvent, getApi } from '../utils'
import { BlockchainBountiesConfigurationDto } from './dto/blockchain-bounties-configuration.dto'
import { BlockchainBountyDto, BlockchainBountyStatus } from './dto/blockchain-bounty.dto'
import { BlockchainService } from '../blockchain.service'
import { PalletBountiesBountyStatus } from '@polkadot/types/lookup'
import { DeriveBounty, DeriveCollectiveProposal } from '@polkadot/api-derive/types'
import { BlockNumber } from '@polkadot/types/interfaces'
import BN from 'bn.js'
import { extractTime } from '@polkadot/util'
import { AccountId32 } from '@polkadot/types/interfaces/runtime'
import { u32 } from '@polkadot/types'
import { ProposedMotionDto, toBlockchainMotion } from '../dto/proposed-motion.dto'

const logger = getLogger()

interface BountyStatusData {
    curator: AccountId32
    updateDue?: u32
    beneficiary?: AccountId32
    unlockAt?: u32
}

@Injectable()
export class BlockchainBountiesService {
    constructor(
        @Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections,
        private readonly blockchainService: BlockchainService,
    ) {}

    static extractBountyIndex(extrinsicEvents: ExtrinsicEvent[]): number | undefined {
        logger.info('Looking for a bounty proposal index')
        return extractNumberFromBlockchainEvent(extrinsicEvents, 'bounties', 'BountyProposed', 0)
    }

    getBountiesConfig(networkId: string): BlockchainBountiesConfigurationDto | undefined {
        try {
            const bountiesConsts = getApi(this.blockchainsConnections, networkId).consts.bounties
            if (!bountiesConsts) {
                return
            }

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
        } catch (err) {
            logger.error('Error while fetching bounties configuration', err)
        }
    }
    async getBounties(networkId: string): Promise<BlockchainBountyDto[]> {
        const deriveBounties = await this.getDeriveBounties(networkId) // blockchain-bounty currently hold in blockchain
        return this.toBlockchainBountyDto(deriveBounties, networkId)
    }
    async getBounty(networkId: string, index: number): Promise<Nil<BlockchainBountyDto>> {
        const deriveBounty = await this.getDeriveBounty(networkId, index) // blockchain-bounty currently hold in blockchain
        if (!deriveBounty) {
            return null
        }
        const [blockchainBountyDto] = await this.toBlockchainBountyDto([deriveBounty], networkId)
        return blockchainBountyDto
    }

    private async toBlockchainBountyDto(deriveBounties: DeriveBounty[], networkId: string) {
        const bestNumber = await this.blockchainService.getCurrentBlockNumber(networkId) // time for processing one block
        const blockTime = this.blockchainService.getBlockTime(networkId) // time for processing one block
        return deriveBounties.map(({ index, description, bounty }) => {
            const proposerAddress = bounty.proposer.toString()
            const { status, data: bountyStatusData } = BlockchainBountiesService.getBountyStatusData(bounty.status)
            const { curator, updateDue, unlockAt, beneficiary } = bountyStatusData ?? {}
            const curatorAddress = curator?.toString()
            const beneficiaryAddress = beneficiary?.toString()
            return new BlockchainBountyDto({
                index: Number(index.toString()),
                description,
                proposer: proposerAddress,
                value: bounty.value.toString() as NetworkPlanckValue,
                fee: bounty.fee.toString() as NetworkPlanckValue,
                curator: curatorAddress,
                updateDue: BlockchainBountiesService.getBlockchainTimeLeft(bestNumber, updateDue, blockTime),
                beneficiary: beneficiaryAddress,
                unlockAt: BlockchainBountiesService.getBlockchainTimeLeft(bestNumber, unlockAt, blockTime),
                curatorDeposit: bounty.curatorDeposit.toString() as NetworkPlanckValue,
                bond: bounty.bond.toString() as NetworkPlanckValue,
                status,
            })
        })
    }

    private static getBlockchainTimeLeft(currentBlock: BlockNumber, futureBlock: Nil<BlockNumber>, blockTime: BN) {
        if (!futureBlock || futureBlock.cmp(currentBlock) !== 1) return
        const blocksLeft = futureBlock.sub(currentBlock)
        return extractTime(Math.abs(blocksLeft.mul(blockTime).toNumber()))
    }

    private static getBountyStatusData(
        bountyStatus: PalletBountiesBountyStatus,
    ): { status: BlockchainBountyStatus; data?: BountyStatusData } {
        const proposed = bountyStatus.isProposed ? { status: BlockchainBountyStatus.Proposed } : null
        const approved = bountyStatus.isApproved ? { status: BlockchainBountyStatus.Approved } : null
        const funded = bountyStatus.isFunded ? { status: BlockchainBountyStatus.Funded } : null
        const curatorProposed = bountyStatus.isCuratorProposed
            ? { status: BlockchainBountyStatus.CuratorProposed, data: bountyStatus.asCuratorProposed }
            : null
        const active = bountyStatus.isActive
            ? { status: BlockchainBountyStatus.Active, data: bountyStatus.asActive }
            : null
        const pendingPayout = bountyStatus.isPendingPayout
            ? { status: BlockchainBountyStatus.PendingPayout, data: bountyStatus.asPendingPayout }
            : null
        return proposed ?? approved ?? funded ?? curatorProposed ?? active ?? pendingPayout!
    }

    async getDeriveBounties(networkId: string) {
        const api = getApi(this.blockchainsConnections, networkId)
        return api.derive.bounties.bounties()
    }

    private async getDeriveBounty(networkId: string, index: number): Promise<Nil<DeriveBounty>> {
        const deriveBounties = await this.getDeriveBounties(networkId)
        const deriveBounty = deriveBounties.find((db) => Number(db.index.toString()) === index)
        return deriveBounty
    }

    async getMotions(networkId: string, index: number): Promise<ProposedMotionDto[]> {
        const deriveBounty = await this.getDeriveBounty(networkId, index)
        if (!deriveBounty) {
            return []
        }
        const currentBlockNumber = await this.blockchainService.getCurrentBlockNumber(networkId)
        const motions = deriveBounty.proposals
        const toBlockchainMotionEnd = (endBlock: BlockNumber) =>
            this.blockchainService.getRemainingTime(networkId, currentBlockNumber, endBlock)
        return motions
            .map((motion) => toBlockchainMotion(motion, toBlockchainMotionEnd))
            .filter((motion) => !!motion) as ProposedMotionDto[]
    }

    async getTotalBountiesCount(networkId: string) {
        const api = getApi(this.blockchainsConnections, networkId)
        const count = await api.query.bounties.bountyCount()
        return count.toNumber()
    }
}
