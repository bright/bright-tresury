import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
    ArrayMaxSize,
    ArrayNotContains,
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
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
    @IsUrl(undefined, { each: true })
    links?: string[]
}

export function toCreateIdeaProposalDetailsDto(
    { title, content, field, contact, portfolio, links }: IdeaProposalDetails,
    milestoneDetails?: MilestoneDetails,
): CreateIdeaProposalDetailsDto {
    const dto = new CreateIdeaProposalDetailsDto()
    dto.title = title
    dto.content = content
    dto.field = field
    dto.contact = contact
    dto.portfolio = portfolio
    dto.links = links ? (JSON.parse(links) as string[]) : undefined

    if (milestoneDetails) {
        const { subject, dateFrom, dateTo, description } = milestoneDetails
        dto.title += ` - ${subject}`
        if (dateFrom && dateTo) {
            dto.content += `\n${dateFrom} - ${dateTo}`
        }
        if (description) {
            dto.content += `\n${description}`
        }
    }
    return dto
}
