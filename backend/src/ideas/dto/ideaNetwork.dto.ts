import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { IdeaNetwork } from '../entities/ideaNetwork.entity'
import { ExtrinsicDto, toExtrinsicDto } from '../../extrinsics/dto/extrinsic.dto'

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
    name: string

    @ApiProperty({
        description: 'Reward for the idea in the network',
        type: Number,
    })
    @IsNumber()
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
