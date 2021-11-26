import { BlockchainBountiesService } from '../blockchain/blockchain-bounties/blockchain-bounties.service'
import { BlockchainService } from '../blockchain/blockchain.service'
import { UpdateExtrinsicDto } from '../extrinsics/dto/updateExtrinsic.dto'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import { createWeb3SessionData } from '../ideas/spec.helpers'
import {
    BlockchainBountyDto,
    BlockchainBountyStatus,
} from '../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { UserEntity } from '../users/user.entity'
import { NETWORKS } from '../utils/spec.helpers'
import { NetworkPlanckValue } from '../utils/types'
import { BountiesService } from './bounties.service'
import { CreateBountyDto } from './dto/create-bounty.dto'
import { DeriveBounties, DeriveBounty } from '@polkadot/api-derive/types'

// listen for extrinsic
export const updateExtrinsicDto: UpdateExtrinsicDto = {
    blockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
    events: [
        {
            section: 'bounties',
            method: 'BountyProposed',
            data: [
                {
                    name: 'BountyIndex',
                    value: '3',
                },
            ],
        },
    ],
} as UpdateExtrinsicDto

export const updateExtrinsicWithNoEventsDto: UpdateExtrinsicDto = {
    blockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
    events: [] as ExtrinsicEvent[],
} as UpdateExtrinsicDto

export async function mockListenForExtrinsic(blockchainService: BlockchainService) {
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

export async function mockListenForExtrinsicWithNoEvent(blockchainService: BlockchainService) {
    jest.spyOn(blockchainService, 'listenForExtrinsic').mockImplementation(
        async (
            networkId: string,
            extrinsicHash: string,
            cb: (updateExtrinsicDto: UpdateExtrinsicDto) => Promise<void>,
        ) => {
            await cb(updateExtrinsicWithNoEventsDto)
        },
    )
}

// bounty entity

export const minimalValidCreateDto = {
    blockchainDescription: 'bc-description',
    value: '10' as NetworkPlanckValue,
    title: 'title',
    networkId: NETWORKS.POLKADOT,
    proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
    extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
    lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
    blockchainIndex: 0,
}

export const createBountyEntity = (service: BountiesService, user: UserEntity, createDto: Partial<CreateBountyDto>) =>
    service.create({ ...minimalValidCreateDto, ...createDto, blockchainIndex: createDto.blockchainIndex ?? 0 }, user)

// bounty blockchain

export async function mockGetBounties(
    service: BlockchainBountiesService,
    bounties: BlockchainBountyDto[] = blockchainBounties,
) {
    jest.spyOn(service, 'getBounties').mockImplementation(async (networkId) => blockchainBounties)
}

export const createProposerSessionData = (bounty: BlockchainBountyDto) => createWeb3SessionData(bounty.proposer.address)

export const createCuratorSessionData = (bounty: BlockchainBountyDto) => createWeb3SessionData(bounty.curator!.address)

export const createBeneficiarySessionData = (bounty: BlockchainBountyDto) =>
    createWeb3SessionData(bounty.beneficiary!.address)

export const blockchainBounty0 = new BlockchainBountyDto({
    index: 0,
    description: 'bc-description-1',
    proposer: { address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5' },
    value: '10000' as NetworkPlanckValue,
    fee: '100' as NetworkPlanckValue,
    curatorDeposit: '0' as NetworkPlanckValue,
    bond: '10' as NetworkPlanckValue,
    status: BlockchainBountyStatus.Proposed,
})
export const blockchainBounty1 = new BlockchainBountyDto({
    index: 1,
    description: 'bc-description-2',
    proposer: { address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5' },
    value: '10000' as NetworkPlanckValue,
    fee: '100' as NetworkPlanckValue,
    curatorDeposit: '0' as NetworkPlanckValue,
    bond: '10' as NetworkPlanckValue,
    status: BlockchainBountyStatus.Proposed,
})
export const blockchainBountyApproved = new BlockchainBountyDto({
    index: 2,
    description: 'bc-description-2',
    proposer: { address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5' },
    value: '10000' as NetworkPlanckValue,
    fee: '100' as NetworkPlanckValue,
    curatorDeposit: '0' as NetworkPlanckValue,
    bond: '10' as NetworkPlanckValue,
    status: BlockchainBountyStatus.Approved,
})
export const blockchainBountyFunded = new BlockchainBountyDto({
    index: 3,
    description: 'bc-description-2',
    proposer: { address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5' },
    value: '10000' as NetworkPlanckValue,
    fee: '100' as NetworkPlanckValue,
    curatorDeposit: '0' as NetworkPlanckValue,
    bond: '10' as NetworkPlanckValue,
    status: BlockchainBountyStatus.Funded,
})
export const blockchainBountyCuratorProposed = new BlockchainBountyDto({
    index: 4,
    description: 'bc-description-2',
    proposer: { address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5' },
    curator: { address: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3' },
    value: '10000' as NetworkPlanckValue,
    fee: '100' as NetworkPlanckValue,
    curatorDeposit: '0' as NetworkPlanckValue,
    bond: '10' as NetworkPlanckValue,
    status: BlockchainBountyStatus.CuratorProposed,
})
export const blockchainBountyActive = new BlockchainBountyDto({
    index: 5,
    description: 'bc-description-2',
    proposer: { address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5' },
    curator: { address: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3' },
    value: '10000' as NetworkPlanckValue,
    fee: '100' as NetworkPlanckValue,
    curatorDeposit: '0' as NetworkPlanckValue,
    bond: '10' as NetworkPlanckValue,
    status: BlockchainBountyStatus.Active,
})
export const blockchainBountyPendingPayout = new BlockchainBountyDto({
    index: 6,
    description: 'bc-description-2',
    proposer: { address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5' },
    curator: { address: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3' },
    beneficiary: { address: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3' },
    value: '10000' as NetworkPlanckValue,
    fee: '100' as NetworkPlanckValue,
    curatorDeposit: '0' as NetworkPlanckValue,
    bond: '10' as NetworkPlanckValue,
    status: BlockchainBountyStatus.PendingPayout,
})

export const blockchainBounties = [
    blockchainBounty0,
    blockchainBounty1,
    blockchainBountyApproved,
    blockchainBountyFunded,
    blockchainBountyCuratorProposed,
    blockchainBountyActive,
    blockchainBountyPendingPayout,
]

export const blockchainDeriveBounties = [
    {
        index: 0,
        description: 'bc-description-1',
        bounty: {
            proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
            value: '10000',
            fee: '100',
            curatorDeposit: '0',
            bond: '10',
            status: {
                isProposed: true
            }
        }
    } as unknown as DeriveBounty,
    {
        index: 1,
        description: 'bc-description-2',
        bounty: {
            proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
            value: '10000',
            fee: '100',
            curatorDeposit: '0',
            bond: '10',
            status: {
                isProposed: true
            }
        }
    } as unknown as DeriveBounty,
] as DeriveBounties
