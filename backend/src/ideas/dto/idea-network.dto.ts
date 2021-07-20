import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, Min, Validate } from 'class-validator'
import { IdeaNetwork } from '../entities/idea-network.entity'
import { ExtrinsicDto, toExtrinsicDto } from '../../extrinsics/dto/extrinsic.dto'
import { IsValidNetworkConstraint } from '../../utils/network.validator'

export class IdeaNetworkDto {
    @ApiPropertyOptional({
        description: 'Id of the idea network',
    })
    @IsOptional()
    id?: string

    @ApiProperty({
        description: 'Name of the network',
    })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    name: string

    @ApiProperty({
        description: 'Reward for the idea in the network',
        type: Number,
    })
    @IsNumber()
    @Min(0)
    value: number

    @IsOptional()
    extrinsic: ExtrinsicDto | null

    constructor({ id, name, value, extrinsic }: IdeaNetwork) {
        this.id = id
        this.name = name
        this.value = Number(value)
        this.extrinsic = extrinsic ? toExtrinsicDto(extrinsic) : null
    }
}
