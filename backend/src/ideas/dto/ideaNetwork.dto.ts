import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {IdeaNetwork} from "../entities/ideaNetwork.entity";
import {ExtrinsicDto, toExtrinsicDto} from "../../extrinsics/dto/extrinsic.dto";

export class IdeaNetworkDto {
    @ApiPropertyOptional({
        description: 'Id of the idea network'
    })
    @IsOptional()
    id?: string

    @ApiProperty({
        description: 'Name of the network'
    })
    @IsNotEmpty()
    name: string

    @ApiProperty({
        description: 'Reward for the idea in the network',
        type: Number
    })
    @IsNumber()
    value: number

    @IsOptional()
    extrinsic: ExtrinsicDto | null

    constructor(
        name: string,
        value: number,
        extrinsic: ExtrinsicDto | null,
        id?: string,
    ) {
        this.id = id
        this.name = name
        // remove trailing zeros returned from postgres for numeric types
        this.value = Number(value)
        this.extrinsic = extrinsic
    }
}

export function toIdeaNetworkDto(ideaNetwork: IdeaNetwork) {
    return new IdeaNetworkDto(
        ideaNetwork.name,
        ideaNetwork.value,
        ideaNetwork.extrinsic ? toExtrinsicDto(ideaNetwork.extrinsic) : null,
        ideaNetwork.id,
    )
}
