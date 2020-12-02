import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {ArrayMinSize, IsArray, IsNotEmpty, IsOptional, MaxLength, Min, ValidateNested} from "class-validator";
import {IdeaNetworkDto} from "./ideaNetworkDto";
import {ideaRestrictions} from "../idea.entity";
import {Type} from "class-transformer";

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
    @ValidateNested({each: true})
    @Type(() => IdeaNetworkDto)
    @ArrayMinSize(1)
    networks!: IdeaNetworkDto[]

    @ApiPropertyOptional()
    // @IsOptional()
    contact?: string

    @ApiPropertyOptional()
    // @IsOptional()
    portfolio?: string

    @ApiPropertyOptional({
        type: [String]
    })
    @IsArray()
    @IsOptional()
    links?: string[]

}
