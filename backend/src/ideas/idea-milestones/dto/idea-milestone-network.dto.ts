import { ApiProperty } from '@nestjs/swagger'
import { IdeaMilestoneNetworkEntity } from '../entities/idea-milestone-network.entity'
import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID, Validate } from 'class-validator'
import { ExtrinsicDto, toExtrinsicDto } from '../../../extrinsics/dto/extrinsic.dto'
import { IsValidNetworkConstraint } from '../../../utils/network.validator'
import { IdeaMilestoneNetworkStatus } from '../entities/idea-milestone-network-status'
import { NetworkPlanckValue } from '../../../utils/types'

export class IdeaMilestoneNetworkDto {
    @ApiProperty({
        description: 'Id of the idea milestone network',
    })
    @IsOptional()
    @IsUUID('4')
    id?: string

    @ApiProperty({
        description: 'Name of the network',
    })
    @IsNotEmpty()
    @IsString()
    @Validate(IsValidNetworkConstraint)
    name: string

    @ApiProperty({
        description: 'Reward for the milestone in the network in Planck',
    })
    @IsNotEmpty()
    @IsNumberString({ no_symbols: true })
    value: NetworkPlanckValue

    @IsOptional()
    extrinsic: ExtrinsicDto | null

    @ApiProperty({
        description: 'Status of the idea milestone in this network',
    })
    status: IdeaMilestoneNetworkStatus

    constructor({ id, name, value, extrinsic, status }: IdeaMilestoneNetworkEntity) {
        this.id = id
        this.name = name
        this.value = value
        this.extrinsic = extrinsic ? toExtrinsicDto(extrinsic) : null
        this.status = status
    }
}
