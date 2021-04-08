import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IdeaNetworkDto, toIdeaNetworkDto} from "./ideaNetwork.dto";
import {Idea, ideaRestrictions} from "../entities/idea.entity";
import {IdeaNetwork} from "../entities/ideaNetwork.entity";
import {IdeaStatus} from "../ideaStatus";
import {IdeaMilestoneDto} from "../ideaMilestones/dto/ideaMilestoneDto";

export class IdeaDto {
    @ApiProperty()
    id!: string

    @ApiProperty()
    title!: string

    @ApiPropertyOptional()
    content?: string

    @ApiPropertyOptional()
    beneficiary?: string

    @ApiPropertyOptional({maxLength: ideaRestrictions.field.maxLength})
    field?: string

    @ApiProperty({
        type: [IdeaNetworkDto]
    })
    networks!: IdeaNetworkDto[]

    @ApiPropertyOptional()
    contact?: string

    @ApiPropertyOptional()
    portfolio?: string

    @ApiPropertyOptional({
        type: [String]
    })
    links?: string[]

    @ApiProperty()
    ordinalNumber: number

    @ApiProperty({enum: IdeaStatus})
    status: IdeaStatus

    @ApiProperty({
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
