import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ExtrinsicEvent } from '../../extrinsics/extrinsicEvent'
import { getLogger } from '../../logging.module'
import { NetworkPlanckValue, Nil } from '../../utils/types'
import { BlockchainsConnections } from '../blockchain.module'
import { extractNumberFromBlockchainEvent, getApi } from '../utils'
import { BlockchainBountiesConfigurationDto } from './dto/blockchain-bounties-configuration.dto'
import { BlockchainBountyDto, BlockchainBountyStatus } from './dto/blockchain-bounty.dto'
import { BlockchainService } from '../blockchain.service'
import { toBlockchainAccountInfo } from '../dto/blockchain-account-info.dto'
import { PalletBountiesBountyStatus } from '@polkadot/types/lookup'
import { DeriveBounties, DeriveBounty, DeriveCollectiveProposal } from '@polkadot/api-derive/types'
import { BlockNumber } from '@polkadot/types/interfaces'
import BN from 'bn.js'
import { extractTime } from '@polkadot/util'
import { AccountId32 } from '@polkadot/types/interfaces/runtime'
import { u32 } from '@polkadot/types'
import { BlockchainMotionDto, toBlockchainMotion } from '../dto/blockchain-motion.dto'

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
        const deriveBounties = await this.getDeriveBounties(networkId) // blockchain-bounty currently hold in blockchain
        return this.toBlockchainBountyDto(deriveBounties, networkId)
    }
    async getBounty(networkId: string, index: number): Promise<BlockchainBountyDto> {
        const deriveBounty = await this.getDeriveBounty(networkId, index) // blockchain-bounty currently hold in blockchain
        const [blockchainBountyDto] = await this.toBlockchainBountyDto([deriveBounty], networkId)
        return blockchainBountyDto
    }

    private async toBlockchainBountyDto(deriveBounties: DeriveBounty[], networkId: string) {
        const bestNumber = await this.blockchainService.getCurrentBlockNumber(networkId) // time for processing one block
        const blockTime = this.blockchainService.getBlockTime(networkId) // time for processing one block
        const identities = await this.blockchainService.getIdentities(
            networkId,
            BlockchainBountiesService.getAllAddresses(deriveBounties),
        ) // fetch proposers, curators and beneficiaries identities
        return deriveBounties.map(({ index, description, bounty }) => {
            const proposerAddress = bounty.proposer.toString()
            const { status, data: bountyStatusData } = BlockchainBountiesService.getBountyStatusData(bounty.status)
            const { curator, updateDue, unlockAt, beneficiary } = bountyStatusData ?? {}
            const curatorAddress = curator?.toString()
            const beneficiaryAddress = beneficiary?.toString()
            return new BlockchainBountyDto({
                index: Number(index.toString()),
                description,
                proposer: toBlockchainAccountInfo(proposerAddress, identities.get(proposerAddress)),
                value: bounty.value.toString() as NetworkPlanckValue,
                fee: bounty.fee.toString() as NetworkPlanckValue,
                curator: curatorAddress
                    ? toBlockchainAccountInfo(curatorAddress, identities.get(curatorAddress))
                    : undefined,
                updateDue: BlockchainBountiesService.getBlockchainTimeLeft(bestNumber, updateDue, blockTime),
                beneficiary: beneficiaryAddress
                    ? toBlockchainAccountInfo(beneficiaryAddress, identities.get(beneficiaryAddress))
                    : undefined,
                unlockAt: BlockchainBountiesService.getBlockchainTimeLeft(bestNumber, unlockAt, blockTime),
                curatorDeposit: bounty.curatorDeposit.toString() as NetworkPlanckValue,
                bond: bounty.bond.toString() as NetworkPlanckValue,
                status,
            })
        })
    }

    private static getAllAddresses(bountiesDerived: DeriveBounties) {
        const proposersAddresses = BlockchainBountiesService.getProposersAddresses(bountiesDerived) // all proposers addresses
        const curatorsAddresses = BlockchainBountiesService.getCuratorsAddresses(bountiesDerived) // all curators addresses (if exists)
        const beneficiariesAddresses = BlockchainBountiesService.getBeneficiariesAddresses(bountiesDerived) // all beneficiaries addresses (if exists)
        return [...proposersAddresses, ...curatorsAddresses, ...beneficiariesAddresses]
    }

    private static getBlockchainTimeLeft(currentBlock: BlockNumber, futureBlock: Nil<BlockNumber>, blockTime: BN) {
        if (!futureBlock || futureBlock.cmp(currentBlock) !== 1) return
        const blocksLeft = futureBlock.sub(currentBlock)
        return extractTime(Math.abs(blocksLeft.mul(blockTime).toNumber()))
    }
    private static getProposersAddresses(bountiesDerived: DeriveBounties): string[] {
        return bountiesDerived.map((bountyDerived) => bountyDerived.bounty.proposer.toString())
    }

    private static getCuratorsAddresses(bountiesDerived: DeriveBounties): string[] {
        return bountiesDerived
            .map(({ bounty }) => BlockchainBountiesService.getBountyStatusData(bounty.status))
            .filter(({ data }) => data?.curator !== undefined)
            .map(({ data }) => data!.curator.toString())
    }

    private static getBeneficiariesAddresses(bountiesDerived: DeriveBounties): string[] {
        return bountiesDerived
            .map(({ bounty }) => BlockchainBountiesService.getBountyStatusData(bounty.status))
            .filter(({ data }) => data?.beneficiary !== undefined)
            .map(({ data }) => data!.beneficiary!.toString())
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

    private async getDeriveBounty(networkId: string, index:number) {
        const deriveBounties = await this.getDeriveBounties(networkId)
        const deriveBounty = deriveBounties.find((db) => Number(db.index.toString()) === index)
        if(!deriveBounty)
            throw new NotFoundException(`Bounty with given blockchain index was not found: ${index}`)
        return deriveBounty
    }
    private static getVoters(motions: DeriveCollectiveProposal[]): string[] {
        const voters = motions.map( (motion) => [
            ...(motion.votes?.ayes?.map(accountId => accountId.toHuman()) ?? []),
            ...(motion.votes?.nays?.map(accountId => accountId.toHuman()) ?? [])
        ]).reduce((acc, motionVoters) => {
            motionVoters.forEach(voter => acc.add(voter))
            return acc
        }, new Set<string>())
        return [...voters]
    }
    async getMotions( networkId: string, index: number): Promise<BlockchainMotionDto[]> {
        const deriveBounty = await this.getDeriveBounty(networkId, index)
        const currentBlockNumber = await this.blockchainService.getCurrentBlockNumber(networkId)
        const motions = deriveBounty.proposals
        const identities = await this.blockchainService.getIdentities(
            networkId, BlockchainBountiesService.getVoters(motions)
        ) // fetch proposers, curators and beneficiaries identities
        const toBlockchainMotionEnd = (endBlock: BlockNumber) => this.blockchainService.getRemainingTime(networkId, currentBlockNumber, endBlock)
        return motions.map(motion => toBlockchainMotion(motion, identities, toBlockchainMotionEnd))
    }
}
