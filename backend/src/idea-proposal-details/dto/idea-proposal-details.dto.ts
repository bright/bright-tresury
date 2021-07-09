import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IdeaProposalDetail, ideaProposalDetailRestrictions } from '../idea-proposal-detail.entity'

export class IdeaProposalDetailDto {
    @ApiProperty({
        description: 'Description of the idea',
    })
    title!: string

    @ApiPropertyOptional({
        description: 'Reason of the idea',
    })
    content?: string

    @ApiPropertyOptional({
        description: 'Field of the idea',
        maxLength: ideaProposalDetailRestrictions.field.maxLength,
    })
    field?: string

    @ApiPropertyOptional({
        description: 'Contact to the idea proposer',
    })
    contact?: string

    @ApiPropertyOptional({
        description: 'Portfolio of the idea proposer',
    })
    portfolio?: string

    @ApiPropertyOptional({
        description: 'External links connected with the idea',
        type: [String],
    })
    links?: string[]

    constructor({ title, content, field, contact, portfolio, links }: IdeaProposalDetail) {
        this.title = title
        this.content = content
        this.field = field
        this.contact = contact
        this.portfolio = portfolio
        this.links = links ? (JSON.parse(links) as string[]) : undefined
    }
}
