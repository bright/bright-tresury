import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {Allow, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {IdeaNetwork} from "../ideaNetwork.entity";
import {ExtrinsicDto, toExtrinsicDto} from "../../extrinsics/dto/extrinsic.dto";

export class IdeaNetworkDto {
    @ApiPropertyOptional()
    @IsOptional()
    id?: string

    @ApiProperty()
    @IsNotEmpty()
    name: string

    @ApiProperty({type: Number})
    @IsNumber()
    value: number

    @Allow()
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
