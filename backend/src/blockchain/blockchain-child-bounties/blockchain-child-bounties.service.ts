import { Inject, Injectable } from '@nestjs/common'
import { BlockchainsConnections } from '../blockchain.module'
import { BlockchainService } from '../blockchain.service'
import { getApi } from '../utils'
import { BlockchainChildBountyDto, BlockchainChildBountyStatus } from './dto/blockchain-child-bounty.dto'
import { PalletChildBountiesChildBountyStatus } from '@polkadot/types/lookup'
import { u32 } from '@polkadot/types'
import { StorageKey } from '@polkadot/types/primitive/StorageKey'
import { AccountId32 } from '@polkadot/types/interfaces/runtime'
import { NetworkPlanckValue } from '../../utils/types'

interface ChildBountyId {
    bountyId: number
    childBountyId: number
}

@Injectable()
export class BlockchainChildBountiesService {
    constructor(@Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections) {}

    async getAllChildBounties(networkId: string): Promise<BlockchainChildBountyDto[]> {
        const ids = await this.getAllChildBountiesIds(networkId)
        return this.getChildBountiesWithIds(networkId, ids)
    }

    async getBountyChildBounties(networkId: string, bountyId: number): Promise<BlockchainChildBountyDto[]> {
        const ids = (await this.getAllChildBountiesIds(networkId)).filter(
            ({ bountyId: anyBountyId }) => anyBountyId === bountyId,
        )
        return this.getChildBountiesWithIds(networkId, ids)
    }

    async getChildBounty(networkId: string, childBountyId: ChildBountyId): Promise<BlockchainChildBountyDto> {
        const childBounties = await this.getChildBountiesWithIds(networkId, [childBountyId])
        return childBounties[0]
    }

    private async getAllChildBountiesIds(networkId: string) {
        const api = getApi(this.blockchainsConnections, networkId)
        const ids = await api.query.childBounties.childBounties.keys()
        return ids.map(BlockchainChildBountiesService.parseRawId)
    }

    private static parseRawId(rawId: StorageKey<[u32, u32]>): ChildBountyId {
        const {
            args: [bountyId, childBountyId],
        } = rawId
        return {
            bountyId: bountyId.toNumber(),
            childBountyId: childBountyId.toNumber(),
        }
    }

    async getChildBountiesWithIds(networkId: string, ids: ChildBountyId[]): Promise<BlockchainChildBountyDto[]> {
        if (!ids.length) return []
        const api = getApi(this.blockchainsConnections, networkId)
        const childBountiesBase = api.query.childBounties
        const [maybeChildBounties, maybeDescriptions] = await Promise.all([
            childBountiesBase.childBounties.multi(ids.map(({ bountyId, childBountyId }) => [bountyId, childBountyId])),
            childBountiesBase.childBountyDescriptions.multi(ids.map(({ childBountyId }) => childBountyId)),
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
                    index: ids[index].childBountyId,
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
}
