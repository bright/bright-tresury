import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {ArrayMinSize, IsDateString, IsISO8601, IsNotEmpty, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {IdeaMilestoneNetworkDto} from "./ideaMilestoneNetworkDto";

export class CreateIdeaMilestoneDto {
    @ApiProperty({
        description: 'Subject of the milestone'
    })
    @IsNotEmpty()
    @IsString()
    subject: string

    @ApiPropertyOptional({
        description: 'Date of start of the milestone'
    })
    @IsOptional()
    // https://github.com/typestack/class-validator/issues/407
    @IsISO8601()
    dateFrom?: Date

    @ApiPropertyOptional({
        description: 'Date of end of the milestone'
    })
    @IsOptional()
    // https://github.com/typestack/class-validator/issues/407
    @IsISO8601()
    dateTo?: Date

    @ApiPropertyOptional({
        description: 'Description of the milestone'
    })
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty({
        description: 'Networks of the milestone',
        type: [IdeaMilestoneNetworkDto]
    })
    @Type(() => IdeaMilestoneNetworkDto)
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    networks: IdeaMilestoneNetworkDto[]

    constructor(
        subject: string,
        networks: IdeaMilestoneNetworkDto[],
        dateFrom?: Date,
        dateTo?: Date,
        description?: string
    ) {
        this.subject = subject
        this.networks = networks
        this.dateFrom = dateFrom
        this.dateTo = dateTo
        this.description = description
    }
}
