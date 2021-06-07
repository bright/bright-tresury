import { ApiProperty } from '@nestjs/swagger'
import { IdeaMilestoneNetwork } from '../entities/idea.milestone.network.entity'
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator'
import { ExtrinsicDto, toExtrinsicDto } from '../../../extrinsics/dto/extrinsic.dto'

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
    name: string

    @ApiProperty({
        description: 'Reward for the milestone in the network',
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    value: number

    @IsOptional()
    extrinsic: ExtrinsicDto | null

    constructor({ id, name, value, extrinsic }: IdeaMilestoneNetwork) {
        this.id = id
        this.name = name
        this.value = Number(value)
        this.extrinsic = extrinsic ? toExtrinsicDto(extrinsic) : null
    }
}
