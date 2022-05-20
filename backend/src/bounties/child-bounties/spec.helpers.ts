import { ListenForChildBountyDto } from './dto/listen-for-child-bounty.dto'
import { NETWORKS } from '../../utils/spec.helpers'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { UpdateExtrinsicDto } from '../../extrinsics/dto/updateExtrinsic.dto'
import { ExtrinsicEvent } from '../../extrinsics/extrinsicEvent'

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
