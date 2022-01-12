import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IdeaProposalDetailsEntity, ideaProposalDetailsRestrictions } from '../idea-proposal-details.entity'

export class IdeaProposalDetailsDto {
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
        maxLength: ideaProposalDetailsRestrictions.field.maxLength,
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

    constructor({ title, content, field, contact, portfolio, links }: IdeaProposalDetailsEntity) {
        this.title = title
        this.content = content
        this.field = field
        this.contact = contact
        this.portfolio = portfolio
        this.links = links ? (JSON.parse(links) as string[]) : undefined
    }
}
