import {ApiProperty} from "@nestjs/swagger";
import {ArrayMinSize, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {IdeaMilestoneNetworkDto} from "./ideaMilestoneNetworkDto";

export class CreateIdeaMilestoneDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    subject: string

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    dateFrom?: Date | null

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    dateTo?: Date | null

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string | null

    @ApiProperty({ type: [IdeaMilestoneNetworkDto] })
    @Type(() => IdeaMilestoneNetworkDto)
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    networks: IdeaMilestoneNetworkDto[]

    constructor(
        subject: string,
        networks: IdeaMilestoneNetworkDto[],
        dateFrom?: Date | null,
        dateTo?: Date | null,
        description?: string | null
    ) {
        this.subject = subject
        this.networks = networks
        this.dateFrom = dateFrom
        this.dateTo = dateTo
        this.description = description
    }
}
