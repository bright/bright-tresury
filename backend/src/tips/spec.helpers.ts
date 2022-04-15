import { BlockchainService } from '../blockchain/blockchain.service'
import { UpdateExtrinsicDto } from '../extrinsics/dto/updateExtrinsic.dto'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import { NETWORKS } from '../utils/spec.helpers'
import { NetworkPlanckValue } from '../utils/types'
import { BlockchainTipDto } from '../blockchain/blockchain-tips/dto/blockchain-tip.dto'

export const aliceAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'
export const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
export const charlieAddress = '14Gjs1TD93gnwEBfDMHoCgsuf1s2TVKUP6Z1qKmAZnZ8cW5q'
export const daveAddress = '126TwBzBM4jUEK2gTphmW4oLoBWWnYvPp8hygmduTr4uds57'

export const validBlockchainTip = new BlockchainTipDto({
    hash: '0x0',
    reason: 'reason',
    who: bobAddress,
    finder: charlieAddress,
    deposit: '1' as NetworkPlanckValue,
    closes: null,
    tips: [],
    findersFee: false,
})

// listen for extrinsic

export const minimalValidListenForTipDto = {
    blockchainReason: 'bc-description',
    title: 'title',
    networkId: NETWORKS.POLKADOT,
    finder: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
    beneficiary: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
    extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
    lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
}

export const updateExtrinsicDto: UpdateExtrinsicDto = {
    blockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
    events: [
        {
            section: 'tips',
            method: 'NewTip',
            data: [
                {
                    name: 'TipHash',
                    value: '0x2c3f6dcddab44cf56b5466182f7b3a6f94b455f7b61175a13d61d905138b35ce',
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
