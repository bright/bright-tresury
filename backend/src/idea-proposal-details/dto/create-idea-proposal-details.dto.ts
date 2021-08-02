import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
    ArrayMaxSize,
    ArrayNotContains,
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    MaxLength,
} from 'class-validator'
import { MilestoneDetails } from '../../milestone-details/entities/milestone-details.entity'
import { IdeaProposalDetails, ideaProposalDetailsRestrictions } from '../idea-proposal-details.entity'

export class CreateIdeaProposalDetailsDto {
    @ApiProperty({ description: 'Title' })
    @IsNotEmpty()
    title!: string

    @ApiPropertyOptional({
        description: 'Reason',
    })
    @IsOptional()
    content?: string

    @ApiPropertyOptional({
        description: 'Field',
        maxLength: ideaProposalDetailsRestrictions.field.maxLength,
    })
    @MaxLength(ideaProposalDetailsRestrictions.field.maxLength)
    @IsOptional()
    field?: string

    @ApiPropertyOptional({
        description: 'Contact to the proposer',
    })
    @IsOptional()
    contact?: string

    @ApiPropertyOptional({
        description: 'Portfolio of the proposer',
    })
    @IsOptional()
    portfolio?: string

    @ApiPropertyOptional({
        description: 'External links',
        type: [String],
    })
    @IsArray()
    @IsOptional()
    @ArrayNotContains(['', null, undefined])
    @ArrayMaxSize(10)
    @IsString({ each: true })
    @Length(1, 1000, { each: true })
    links?: string[]

    constructor(
        { title, content, field, contact, portfolio, links }: IdeaProposalDetails,
        milestoneDetails?: MilestoneDetails,
    ) {
        this.title = title
        this.content = content
        this.field = field
        this.contact = contact
        this.portfolio = portfolio
        this.links = links ? (JSON.parse(links) as string[]) : undefined

        if (milestoneDetails) {
            const { subject, dateFrom, dateTo, description } = milestoneDetails
            this.title += ` - ${subject}`
            if (dateFrom && dateTo) {
                this.content += `\n${dateFrom} - ${dateTo}`
            }
            if (description) {
                this.content += `\n${description}`
            }
        }
    }
}
