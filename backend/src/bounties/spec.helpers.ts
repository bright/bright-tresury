import { BlockchainBountiesService } from '../blockchain/blockchain-bounties/blockchain-bounties.service'
import { BlockchainService } from '../blockchain/blockchain.service'
import { UpdateExtrinsicDto } from '../extrinsics/dto/updateExtrinsic.dto'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import { createWeb3SessionData } from '../ideas/spec.helpers'
import {
    BlockchainBountyDto,
    BlockchainBountyStatus,
} from '../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { PolkassemblyBountyPostDto } from '../polkassembly/bounties/bounty-post.dto'
import { PolkassemblyBountiesService } from '../polkassembly/bounties/polkassembly-bounties.service'
import { PolkassemblyService } from '../polkassembly/polkassembly.service'
import { PolkassemblyBountyPostSchema } from '../polkassembly/bounties/bounty-post.schema'
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

export async function mockGetBounties(service: BlockchainBountiesService) {
    jest.spyOn(service, 'getDeriveBounties').mockImplementation(async (networkId) =>
        Promise.resolve(blockchainDeriveBounties),
    )
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
const blockchainDeriveBounty0 = ({
    index: 0,
    description: 'bc-description-1',
    bounty: {
        proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        value: '10000',
        fee: '100',
        curatorDeposit: '0',
        bond: '10',
        status: {
            isProposed: true,
        },
    },
} as unknown) as DeriveBounty

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
const blockchainDeriveBounty1 = ({
    index: 1,
    description: 'bc-description-2',
    bounty: {
        proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        value: '10000',
        fee: '100',
        curatorDeposit: '0',
        bond: '10',
        status: {
            isProposed: true,
        },
    },
} as unknown) as DeriveBounty

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
const blockchainDeriveBountyApproved = ({
    index: 2,
    description: 'bc-description-2',
    bounty: {
        proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        value: '10000',
        fee: '100',
        curatorDeposit: '0',
        bond: '10',
        status: {
            isApproved: true,
        },
    },
} as unknown) as DeriveBounty

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
const blockchainDeriveBountyFunded = ({
    index: 3,
    description: 'bc-description-2',
    bounty: {
        proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        value: '10000',
        fee: '100',
        curatorDeposit: '0',
        bond: '10',
        status: {
            isFunded: true,
        },
    },
} as unknown) as DeriveBounty

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
const blockchainDeriveBountyCuratorProposed = ({
    index: 4,
    description: 'bc-description-2',
    bounty: {
        proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        value: '10000',
        fee: '100',
        curatorDeposit: '0',
        bond: '10',
        status: {
            isCuratorProposed: true,
            asCuratorProposed: { curator: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3' },
        },
    },
} as unknown) as DeriveBounty

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
const blockchainDeriveBountyActive = ({
    index: 5,
    description: 'bc-description-2',
    bounty: {
        proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        value: '10000',
        fee: '100',
        curatorDeposit: '0',
        bond: '10',
        status: {
            isActive: true,
            asActive: { curator: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3', updateDue: undefined },
        },
    },
} as unknown) as DeriveBounty

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
const blockchainDeriveBountyPendingPayout = ({
    index: 6,
    description: 'bc-description-2',
    bounty: {
        proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        value: '10000',
        fee: '100',
        curatorDeposit: '0',
        bond: '10',
        status: {
            isPendingPayout: true,
            asPendingPayout: {
                curator: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3',
                beneficiary: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3',
                unlockAt: undefined,
            },
        },
    },
} as unknown) as DeriveBounty
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
    blockchainDeriveBounty0,
    blockchainDeriveBounty1,
    blockchainDeriveBountyApproved,
    blockchainDeriveBountyFunded,
    blockchainDeriveBountyCuratorProposed,
    blockchainDeriveBountyActive,
    blockchainDeriveBountyPendingPayout,
] as DeriveBounties

// bounty polkassembly

const bountySchema: PolkassemblyBountyPostSchema = {
    id: 0,
    title: 'polkassembly title',
    content: 'polkassembly content',
    onchain_link: {
        id: 0,
        proposer_address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        onchain_bounty_id: 0,
        onchain_bounty: [
            {
                id: 0,
                bountyId: 0,
                proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                value: '100',
                fee: '10',
                curatorDeposit: '10',
                bond: '10',
                curator: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3',
                beneficiary: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3',
                bountyStatus: [
                    {
                        id: '0',
                        status: 'BountyRejected',
                        blockNumber: {
                            startDateTime: 0,
                            number: 0,
                        },
                    },
                ],
            },
        ],
    },
}

export const polkassemblyBounty0 = new PolkassemblyBountyPostDto(bountySchema)
export const polkassemblyBounty10 = new PolkassemblyBountyPostDto({
    ...bountySchema,
    onchain_link: {
        ...bountySchema.onchain_link,
        onchain_bounty_id: 10,
        onchain_bounty: [{ ...bountySchema.onchain_link.onchain_bounty[0], bountyId: 10 }],
    },
})

export const polkassemblyBounties = [polkassemblyBounty0, polkassemblyBounty10]

export async function mockGetPolkassemblyBounty(service: PolkassemblyBountiesService) {
    jest.spyOn(service, 'findOne').mockImplementation(async (bountyIndex: number, networkId: string) =>
        Promise.resolve(polkassemblyBounties.find((b) => b.blockchainIndex === bountyIndex)),
    )
}
