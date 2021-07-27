import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Nil } from '../../utils/types'

export class CreateMilestoneDetailsDto {
    @ApiProperty({
        description: 'Subject of the milestone',
    })
    @IsNotEmpty()
    @IsString()
    subject!: string

    @ApiPropertyOptional({
        description: 'Date of start of the milestone',
        type: Date,
    })
    @IsOptional()
    // https://github.com/typestack/class-validator/issues/407
    @IsISO8601()
    dateFrom?: Nil<Date>

    @ApiPropertyOptional({
        description: 'Date of end of the milestone',
        type: Date,
    })
    @IsOptional()
    // https://github.com/typestack/class-validator/issues/407
    @IsISO8601()
    dateTo?: Nil<Date>

    @ApiPropertyOptional({
        description: 'Description of the milestone',
    })
    @IsOptional()
    @IsString()
    description?: Nil<string>
}
