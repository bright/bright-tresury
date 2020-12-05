import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsOptional} from "class-validator";

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

    constructor(
        name: string,
        value: number,
        id?: string
    ) {
        this.name = name
        this.value = value
        this.id = id
    }
}
