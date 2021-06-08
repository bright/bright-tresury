import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ArrayMinSize, IsISO8601, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { Nil } from '../../../utils/types'
import { CreateIdeaMilestoneNetworkDto } from './create-idea-milestone-network.dto'
import { IsValidAddress } from '../../../utils/address/address.validator'

export class CreateIdeaMilestoneDto {
    @ApiProperty({
        description: 'Subject of the milestone',
    })
    @IsNotEmpty()
    @IsString()
    subject: string

    @ApiPropertyOptional({
        description: 'Blockchain address of the idea milestone beneficiary',
    })
    @IsOptional()
    @IsValidAddress()
    beneficiary: Nil<string>

    @ApiPropertyOptional({
        description: 'Date of start of the milestone',
        type: Date,
    })
    @IsOptional()
    // https://github.com/typestack/class-validator/issues/407
    @IsISO8601()
    dateFrom: Nil<Date>

    @ApiPropertyOptional({
        description: 'Date of end of the milestone',
        type: Date,
    })
    @IsOptional()
    // https://github.com/typestack/class-validator/issues/407
    @IsISO8601()
    dateTo: Nil<Date>

    @ApiPropertyOptional({
        description: 'Description of the milestone',
    })
    @IsOptional()
    @IsString()
    description: Nil<string>

    @ApiProperty({
        description: 'Networks of the milestone',
        type: [CreateIdeaMilestoneNetworkDto],
    })
    @Type(() => CreateIdeaMilestoneNetworkDto)
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    networks: CreateIdeaMilestoneNetworkDto[]

    constructor(
        subject: string,
        networks: CreateIdeaMilestoneNetworkDto[],
        beneficiary: Nil<string>,
        dateFrom: Nil<Date>,
        dateTo: Nil<Date>,
        description: Nil<string>,
    ) {
        this.subject = subject
        this.networks = networks
        this.beneficiary = beneficiary
        this.dateFrom = dateFrom
        this.dateTo = dateTo
        this.description = description
    }
}
