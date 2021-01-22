import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {Allow, ArrayMinSize, IsArray, IsEnum, IsIn, IsNotEmpty, IsOptional, MaxLength, ValidateNested} from "class-validator";
import {IdeaNetworkDto} from "./ideaNetwork.dto";
import {ideaRestrictions} from "../idea.entity";
import {IdeaStatus} from "../ideaStatus";
import {Type} from "class-transformer";

const AllowedIdeaStatuses = [IdeaStatus.Draft, IdeaStatus.Active]

export class CreateIdeaDto {
    @ApiProperty()
    @IsNotEmpty()
    title!: string

    @ApiPropertyOptional()
    @Allow()
    content?: string

    @ApiProperty()
    @Allow()
    beneficiary?: string

    @ApiPropertyOptional({maxLength: ideaRestrictions.field.maxLength})
    @MaxLength(ideaRestrictions.field.maxLength)
    @IsOptional()
    field?: string

    @ApiProperty({
        type: [IdeaNetworkDto]
    })
    @IsNotEmpty()
    @ValidateNested({each: true, always: true})
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

    @ApiPropertyOptional({
        enum: IdeaStatus,
        oneOf: AllowedIdeaStatuses.map((status: IdeaStatus) => {
            return {type: status}
        })
    })
    @IsOptional()
    @IsEnum(IdeaStatus)
    @IsIn(AllowedIdeaStatuses)
    status?: IdeaStatus

}
