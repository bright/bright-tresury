import { ListenForChildBountyDto } from './dto/listen-for-child-bounty.dto'
import { NETWORKS } from '../../utils/spec.helpers'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { UpdateExtrinsicDto } from '../../extrinsics/dto/updateExtrinsic.dto'
import { ExtrinsicEvent } from '../../extrinsics/extrinsicEvent'
import { BlockchainChildBountiesService } from '../../blockchain/blockchain-child-bounties/blockchain-child-bounties.service'
import { ChildBountyId } from '../../blockchain/blockchain-child-bounties/child-bounty-id.interface'
import { NetworkPlanckValue } from '../../utils/types'
import {
    BlockchainChildBountyDto,
    BlockchainChildBountyStatus,
} from '../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'
import { UserEntity } from '../../users/entities/user.entity'
import { ChildBountiesService } from './child-bounties.service'
import { CreateChildBountyDto } from './dto/create-child-bounty.dto'

export const updateExtrinsicWithAddedEventDto: UpdateExtrinsicDto = {
    blockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
    events: [
        {
            section: 'childBounties',
            method: 'Added',
            data: [
                { name: 'u32', value: '0' },
                { name: 'u32', value: '2' },
            ],
        },
    ],
    data: '',
} as UpdateExtrinsicDto

export const updateExtrinsicWithNoEventsDto: UpdateExtrinsicDto = {
    blockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
    events: [] as ExtrinsicEvent[],
} as UpdateExtrinsicDto

export const minimalValidCreateDto: ListenForChildBountyDto = {
    title: 'title',
    networkId: NETWORKS.POLKADOT,
    extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
    lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
}

export async function mockListenForExtrinsic(
    blockchainService: BlockchainService,
    updateExtrinsicDto: UpdateExtrinsicDto,
) {
    jest.spyOn(blockchainService, 'listenForExtrinsic').mockImplementation(
        async (
            networkId: string,
            extrinsicHash: string,
            cb: (updateExtrinsicDto: UpdateExtrinsicDto) => Promise<void>,
        ) => {
            await cb(updateExtrinsicDto)
        },
    )
}

export const blockchainChildBounty4 = new BlockchainChildBountyDto({
    index: 4,
    parentIndex: 4,
    description: 'bc-description',
    value: '2' as NetworkPlanckValue,
    fee: '1' as NetworkPlanckValue,
    curatorDeposit: '0' as NetworkPlanckValue,
    curator: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3',
    beneficiary: '15E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3',
    unlockAt: '',
    status: BlockchainChildBountyStatus.CuratorProposed,
})

export const blockchainChildBountyActive = new BlockchainChildBountyDto({
    index: 3,
    parentIndex: 3,
    description: 'bc-description',
    value: '2' as NetworkPlanckValue,
    fee: '1' as NetworkPlanckValue,
    curatorDeposit: '0' as NetworkPlanckValue,
    curator: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3',
    beneficiary: '15E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3',
    unlockAt: '',
    status: BlockchainChildBountyStatus.Active,
})

export const blockchainChildBountyNoCurator = new BlockchainChildBountyDto({
    index: 2,
    parentIndex: 2,
    description: 'bc-description',
    value: '2' as NetworkPlanckValue,
    fee: '1' as NetworkPlanckValue,
    curatorDeposit: '0' as NetworkPlanckValue,
    curator: undefined,
    beneficiary: '15E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3',
    unlockAt: '',
    status: BlockchainChildBountyStatus.Active,
})

export const blockchainChildBountyCuratorProposed = {
    index: 1,
    parentIndex: 1,
    description: 'bc-description',
    value: '2' as NetworkPlanckValue,
    fee: '1' as NetworkPlanckValue,
    curator: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3',
    curatorDeposit: '0.2' as NetworkPlanckValue,
    status: BlockchainChildBountyStatus.CuratorProposed,
} as BlockchainChildBountyDto

export const blockchainChildBounties = [
    blockchainChildBounty4,
    blockchainChildBountyCuratorProposed,
    blockchainChildBountyActive,
    blockchainChildBountyNoCurator,
]

export async function mockGetChildBounties(service: BlockchainChildBountiesService) {
    jest.spyOn(service, 'getChildBountiesWithIds').mockImplementation(
        async (networkId: string, ids: ChildBountyId[]) => {
            const blockchainTest = blockchainChildBounties.filter((blockchainChildBounty) => {
                const index = blockchainChildBounty.index
                const parentIndex = blockchainChildBounty.parentIndex
                return ids.find((id) => {
                    return id.blockchainIndex === index && id.parentBountyBlockchainIndex === parentIndex
                })
            })
            return Promise.resolve(blockchainTest)
        },
    )
}

export const createChildBountyEntity = (
    service: ChildBountiesService,
    user: UserEntity,
    createDto: Partial<CreateChildBountyDto>,
) =>
    service.create(
        {
            ...minimalValidCreateDto,
            ...createDto,
            blockchainIndex: createDto.blockchainIndex ?? 0,
            parentBountyBlockchainIndex: createDto.parentBountyBlockchainIndex ?? 0,
        },
        user,
    )
