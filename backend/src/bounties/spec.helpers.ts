import { BlockchainService } from '../blockchain/blockchain.service'
import { UpdateExtrinsicDto } from '../extrinsics/dto/updateExtrinsic.dto'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import {
    BlockchainBountyDto,
    BlockchainBountyStatus,
} from '../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { NetworkPlanckValue } from '../utils/types'

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

export const blockchainBounties = [
    new BlockchainBountyDto({
        index: 0,
        description: 'bc-description-1',
        proposer: { address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5' },
        value: '10000' as NetworkPlanckValue,
        fee: '100' as NetworkPlanckValue,
        curatorDeposit: '0' as NetworkPlanckValue,
        bond: '10' as NetworkPlanckValue,
        status: BlockchainBountyStatus.Proposed
    }),
    new BlockchainBountyDto({
        index: 1,
        description: 'bc-description-2',
        proposer: { address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5' },
        value: '10000' as NetworkPlanckValue,
        fee: '100' as NetworkPlanckValue,
        curatorDeposit: '0' as NetworkPlanckValue,
        bond: '10' as NetworkPlanckValue,
        status: BlockchainBountyStatus.Proposed
    }),
]
