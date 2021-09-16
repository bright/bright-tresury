import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Nil } from '../../utils/types'
import { MilestoneDetails } from '../entities/milestone-details.entity'

export class MilestoneDetailsDto {
    @ApiProperty({
        description: 'Subject of the milestone',
    })
    subject: string

    @ApiPropertyOptional({
        description: 'Date of start of the milestone',
        type: Date,
    })
    dateFrom: Nil<Date>

    @ApiPropertyOptional({
        description: 'Date of end of the milestone',
        type: Date,
    })
    dateTo: Nil<Date>

    @ApiPropertyOptional({
        description: 'Description of the milestone',
    })
    description: Nil<string>

    @ApiProperty({
        description: 'Date of creating the milestone',
        type: Date,
    })
    createdAt: Date

    @ApiProperty({
        description: 'Date of updating the milestone',
        type: Date,
    })
    updatedAt: Date

    constructor({ subject, dateFrom, dateTo, description, createdAt, updatedAt }: MilestoneDetails) {
        this.subject = subject
        this.dateFrom = dateFrom
        this.dateTo = dateTo
        this.description = description
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}
