import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class IdeaNetworkDto {
    @ApiPropertyOptional()
    id?: string
    @ApiProperty()
    name: string
    @ApiProperty({type: Number})
    @IsNumber()
    value?: number

    constructor(
        name: string,
        value?: number,
        id?: string
    ) {
        this.name = name
        this.value = value
        this.id = id
    }
}
