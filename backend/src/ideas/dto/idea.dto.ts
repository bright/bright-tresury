import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IdeaNetworkDto, toIdeaNetworkDto} from "./ideaNetwork.dto";
import {Idea, ideaRestrictions} from "../entities/idea.entity";
import {IdeaNetwork} from "../entities/ideaNetwork.entity";
import {IdeaStatus} from "../ideaStatus";
import {IdeaMilestoneDto} from "../ideaMilestones/dto/ideaMilestoneDto";

export class IdeaDto {
    @ApiProperty({
        description: 'Id from the database'
    })
    id!: string

    @ApiProperty({
        description: 'Description of the idea'
    })
    title!: string

    @ApiPropertyOptional({
        description: 'Reason of the idea'
    })
    content?: string

    @ApiPropertyOptional({
        description: 'Blockchain address of the idea beneficiary'
    })
    beneficiary?: string

    @ApiPropertyOptional({
        description: 'Field of the idea',
        maxLength: ideaRestrictions.field.maxLength
    })
    field?: string

    @ApiProperty({
        description: 'Networks of the idea',
        type: [IdeaNetworkDto]
    })
    networks!: IdeaNetworkDto[]

    @ApiPropertyOptional({
        description: 'Contact to the idea proposer'
    })
    contact?: string

    @ApiPropertyOptional({
        description: 'Portfolio of the idea proposer'
    })
    portfolio?: string

    @ApiPropertyOptional({
        description: 'External links connected with the idea',
        type: [String]
    })
    links?: string[]

    @ApiProperty({
        description: 'Ordinal number of the idea'
    })
    ordinalNumber: number

    @ApiProperty({
        description: 'Status of the idea',
        enum: IdeaStatus
    })
    status: IdeaStatus

    @ApiProperty({
        description: 'Milestones of the idea',
        type: [IdeaMilestoneDto]
    })
    milestones!: IdeaMilestoneDto[]

    constructor(
        id: string,
        title: string,
        status: IdeaStatus,
        networks: IdeaNetworkDto[],
        ordinalNumber: number,
        beneficiary?: string,
        content?: string,
        field?: string,
        contact?: string,
        portfolio?: string,
        links?: string[],
    ) {
        this.id = id
        this.title = title
        this.networks = networks
        this.ordinalNumber = ordinalNumber
        this.beneficiary = beneficiary
        this.content = content
        this.field = field
        this.contact = contact
        this.portfolio = portfolio
        this.links = links
        this.status = status
    }

}

export function toIdeaDto({id, title, status, networks, ordinalNumber, beneficiary, content, field, contact, portfolio, links, milestones }: Idea): IdeaDto {
    return new IdeaDto(
        id,
        title,
        status,
        networks ? networks.map((ideaNetwork: IdeaNetwork) =>
            toIdeaNetworkDto(ideaNetwork)
        ) : [],
        ordinalNumber,
        beneficiary,
        content,
        field,
        contact,
        portfolio,
        links ? JSON.parse(links) as string[] : undefined,
    )
}
