import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ExtrinsicDto, toExtrinsicDto } from '../../extrinsics/dto/extrinsic.dto'
import { Nil } from '../../utils/types'
import { IdeaNetworkStatus } from '../entities/idea-network-status'
import { IdeaNetwork } from '../entities/idea-network.entity'

export class IdeaNetworkDto {
    @ApiProperty({
        description: 'Id of the idea network',
    })
    id: string

    @ApiProperty({
        description: 'Name of the network',
    })
    name: string

    @ApiProperty({
        description: 'Reward for the idea in the network',
        type: Number,
    })
    value: number

    @ApiProperty({
        description: 'Status of the network',
        enum: IdeaNetworkStatus,
    })
    status: IdeaNetworkStatus

    @ApiPropertyOptional({
        description: 'Information about the extrinsic',
    })
    extrinsic: ExtrinsicDto | null

    @ApiPropertyOptional({
        description: 'Id of the blockchain proposal created from the idea within the given network',
    })
    blockchainProposalId?: Nil<number>

    constructor({ id, name, value, extrinsic, status, blockchainProposalId }: IdeaNetwork) {
        this.id = id
        this.name = name
        this.status = status
        this.blockchainProposalId = blockchainProposalId
        // TODO change to string
        this.value = Number(value)
        this.extrinsic = extrinsic ? toExtrinsicDto(extrinsic) : null
    }
}
