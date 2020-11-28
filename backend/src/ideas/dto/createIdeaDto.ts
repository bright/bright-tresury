import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {ArrayMinSize, IsArray, IsNotEmpty, IsOptional, MaxLength, Min} from "class-validator";
import {IdeaNetworkDto} from "./ideaNetworkDto";
import {ideaRestrictions} from "../idea.entity";

export class CreateIdeaDto {
    @ApiProperty()
    @IsNotEmpty()
    title!: string

    @ApiPropertyOptional()
    content?: string

    @ApiProperty()
    beneficiary?: string

    @ApiPropertyOptional({maxLength: ideaRestrictions.field.maxLength})
    @MaxLength(ideaRestrictions.field.maxLength)
    @IsOptional()
    field?: string

    @ApiProperty({
        type: [IdeaNetworkDto]
    })
    @IsNotEmpty()
    @ArrayMinSize(1)
    networks!: IdeaNetworkDto[]

    @ApiPropertyOptional()
    contact?: string

    @ApiPropertyOptional()
    portfolio?: string

    @ApiPropertyOptional({
        type: [String]
    })
    @IsArray()
    @IsOptional()
    links?: string[]

}
