import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IdeaNetworkDto } from './idea-network.dto'
import { Idea, ideaRestrictions } from '../entities/idea.entity'
import { IdeaStatus } from '../idea-status'
import { IdeaMilestoneDto } from '../idea-milestones/dto/idea-milestone.dto'

export class IdeaDto {
    @ApiProperty({
        description: 'Id of the idea',
    })
    id!: string

    @ApiProperty({
        description: 'Description of the idea',
    })
    title!: string

    @ApiPropertyOptional({
        description: 'Reason of the idea',
    })
    content?: string

    @ApiPropertyOptional({
        description: 'Blockchain address of the idea beneficiary',
    })
    beneficiary?: string

    @ApiPropertyOptional({
        description: 'Field of the idea',
        maxLength: ideaRestrictions.field.maxLength,
    })
    field?: string

    @ApiProperty({
        description: 'Networks of the idea',
        type: [IdeaNetworkDto],
    })
    networks!: IdeaNetworkDto[]

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

    @ApiProperty({
        description: 'Ordinal number of the idea',
    })
    ordinalNumber: number

    @ApiProperty({
        description: 'Status of the idea',
        enum: IdeaStatus,
    })
    status: IdeaStatus

    @ApiProperty({
        description: 'Milestones of the idea',
        type: [IdeaMilestoneDto],
    })
    milestones!: IdeaMilestoneDto[]

    @ApiProperty()
    ownerId: string

    constructor({
        id,
        title,
        status,
        networks,
        ordinalNumber,
        ownerId,
        beneficiary,
        content,
        field,
        contact,
        portfolio,
        links,
    }: Idea) {
        this.id = id
        this.title = title
        this.status = status
        this.networks = networks ? networks.map((ideaNetwork) => new IdeaNetworkDto(ideaNetwork)) : []
        this.ordinalNumber = ordinalNumber
        this.ownerId = ownerId
        this.beneficiary = beneficiary
        this.content = content
        this.field = field
        this.contact = contact
        this.portfolio = portfolio
        this.links = links ? (JSON.parse(links) as string[]) : undefined
    }
}
