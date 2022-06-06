import { Inject, Injectable } from '@nestjs/common'
import { BlockchainsConnections } from '../blockchain.module'
import { extractNumberFromBlockchainEvent, getApi } from '../utils'
import { BlockchainChildBountyDto, BlockchainChildBountyStatus } from './dto/blockchain-child-bounty.dto'
import { PalletChildBountiesChildBountyStatus } from '@polkadot/types/lookup'
import { u32 } from '@polkadot/types'
import { StorageKey } from '@polkadot/types/primitive/StorageKey'
import { AccountId32 } from '@polkadot/types/interfaces/runtime'
import { NetworkPlanckValue, Nil } from '../../utils/types'
import { ExtrinsicEvent } from '../../extrinsics/extrinsicEvent'
import { getLogger } from '../../logging.module'
import { ChildBountyId } from './child-bounty-id.interface'
import { BlockchainChildBountiesConfigurationDto } from './dto/blockchain-child-bounties-configuration.dto'

const logger = getLogger()

@Injectable()
export class BlockchainChildBountiesService {
    constructor(@Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections) {}

    async getAllChildBountiesIds(networkId: string) {
        const api = getApi(this.blockchainsConnections, networkId)
        const ids = await api.query.childBounties.childBounties.keys()
        return ids.map(BlockchainChildBountiesService.parseRawId)
    }

    async getBountyChildBountiesIds(networkId: string, parentBountyBlockchainIndex: number) {
        return (await this.getAllChildBountiesIds(networkId)).filter(
            ({ parentBountyBlockchainIndex: anyParentBountyBlockchainIndex }) =>
                anyParentBountyBlockchainIndex === parentBountyBlockchainIndex,
        )
    }

    async getAllChildBounties(networkId: string): Promise<BlockchainChildBountyDto[]> {
        const ids = await this.getAllChildBountiesIds(networkId)
        return this.getChildBountiesWithIds(networkId, ids)
    }

    async getBountyChildBounties(
        networkId: string,
        parentBountyBlockchainIndex: number,
    ): Promise<BlockchainChildBountyDto[]> {
        const ids = await this.getBountyChildBountiesIds(networkId, parentBountyBlockchainIndex)
        return this.getChildBountiesWithIds(networkId, ids)
    }
    async getBountyChildBountiesCount(networkId: string, parentBountyBlockchainIndex: number): Promise<number> {
        const api = getApi(this.blockchainsConnections, networkId)
        const childBountiesBase = api.query.childBounties
        const u32Count = await childBountiesBase.parentChildBounties(parentBountyBlockchainIndex)
        return u32Count.toNumber()
    }
    async getChildBounty(networkId: string, childBountyId: ChildBountyId): Promise<BlockchainChildBountyDto> {
        const childBounties = await this.getChildBountiesWithIds(networkId, [childBountyId])
        return childBounties[0]
    }

    private static parseRawId(rawId: StorageKey<[u32, u32]>): ChildBountyId {
        const {
            args: [parentIndex, index],
        } = rawId
        return {
            parentBountyBlockchainIndex: parentIndex.toNumber(),
            blockchainIndex: index.toNumber(),
        }
    }
    private static toRawId(childBountyId: ChildBountyId): [number, number] {
        const { parentBountyBlockchainIndex, blockchainIndex } = childBountyId
        return [parentBountyBlockchainIndex, blockchainIndex]
    }
    async getChildBountiesWithIds(networkId: string, ids: ChildBountyId[]): Promise<BlockchainChildBountyDto[]> {
        if (!ids.length) return []
        const api = getApi(this.blockchainsConnections, networkId)
        const childBountiesBase = api.query.childBounties
        const [maybeChildBounties, maybeDescriptions] = await Promise.all([
            childBountiesBase.childBounties.multi(ids.map(BlockchainChildBountiesService.toRawId)),
            childBountiesBase.childBountyDescriptions.multi(ids.map(({ blockchainIndex }) => blockchainIndex)),
        ])
        return maybeChildBounties
            .map((maybeChildBounty, index) => {
                if (maybeChildBounty.isNone) return
                const childBounty = maybeChildBounty.unwrap()
                const { status, data } = BlockchainChildBountiesService.getChildBountyStatusData(childBounty.status)
                const { curator, beneficiary, unlockAt } = data || {}
                const curatorAddress = curator?.toString()
                const beneficiaryAddress = beneficiary?.toString()
                return {
                    index: ids[index].blockchainIndex,
                    parentIndex: childBounty.parentBounty.toNumber(),
                    description: maybeDescriptions[index].unwrapOrDefault().toUtf8(),
                    value: childBounty.value.toString() as NetworkPlanckValue,
                    fee: childBounty.fee.toString() as NetworkPlanckValue,
                    curator: curatorAddress,
                    curatorDeposit: childBounty.curatorDeposit.toString() as NetworkPlanckValue,
                    beneficiary: beneficiaryAddress,
                    unlockAt: unlockAt?.toString(),
                    status,
                }
            })
            .filter((childBountyDto) => childBountyDto !== undefined) as BlockchainChildBountyDto[]
    }

    private static getChildBountyStatusData(
        childBountyStatus: PalletChildBountiesChildBountyStatus,
    ): {
        status: BlockchainChildBountyStatus
        data?: { curator?: AccountId32; beneficiary?: AccountId32; unlockAt?: u32 }
    } {
        const added = childBountyStatus.isAdded ? { status: BlockchainChildBountyStatus.Added } : null
        const curatorProposed = childBountyStatus.isCuratorProposed
            ? { status: BlockchainChildBountyStatus.CuratorProposed, data: childBountyStatus.asCuratorProposed }
            : null
        const active = childBountyStatus.isActive
            ? { status: BlockchainChildBountyStatus.Active, data: childBountyStatus.asActive }
            : null
        const pendingPayout = childBountyStatus.isPendingPayout
            ? { status: BlockchainChildBountyStatus.PendingPayout, data: childBountyStatus.asPendingPayout }
            : null
        return added ?? curatorProposed ?? active ?? pendingPayout!
    }

    static extractChildBountyIdFromBlockchainEvents(extrinsicEvents: ExtrinsicEvent[]): Nil<ChildBountyId> {
        logger.info('Looking for a child bounty id')
        const parentBountyBlockchainIndex = extractNumberFromBlockchainEvent(
            extrinsicEvents,
            'childBounties',
            'Added',
            0,
        )
        const blockchainIndex = extractNumberFromBlockchainEvent(extrinsicEvents, 'childBounties', 'Added', 1)
        if (parentBountyBlockchainIndex === undefined || blockchainIndex === undefined) return
        return { parentBountyBlockchainIndex, blockchainIndex }
    }

    getChildBountiesConfig(networkId: string): BlockchainChildBountiesConfigurationDto | undefined {
        try {
            const consts = getApi(this.blockchainsConnections, networkId).consts.childBounties
            if (!consts) {
                return
            }

            const childBountyValueMinimum = consts.childBountyValueMinimum.toString() as NetworkPlanckValue
            const maxActiveChildBountyCount = Number(consts.maxActiveChildBountyCount)

            return {
                childBountyValueMinimum,
                maxActiveChildBountyCount,
            }
        } catch (err) {
            logger.error('Error while fetching child bounties configuration', err)
        }
    }
}
