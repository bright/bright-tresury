import {ApiProperty, ApiPropertyOptional, PartialType} from "@nestjs/swagger";
import {ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional, MaxLength, Min, ValidateNested} from "class-validator";
import {IdeaNetworkDto} from "./ideaNetwork.dto";
import {ideaRestrictions} from "../idea.entity";
import {IdeaStatus} from "../ideaStatus";
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
    @IsOptional()
    contact?: string

    @ApiPropertyOptional()
    @IsOptional()
    portfolio?: string

    @ApiPropertyOptional({
        type: [String]
    })
    @IsArray()
    @IsOptional()
    links?: string[]

    @ApiPropertyOptional({enum: IdeaStatus})
    @IsOptional()
    @IsEnum(IdeaStatus)
    status?: IdeaStatus

}
