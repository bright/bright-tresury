import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {Allow, IsArray, IsNotEmpty} from "class-validator";
import {IdeaNetworkDto, toIdeaNetworkDto} from "./ideaNetwork.dto";
import {Idea, ideaRestrictions} from "../idea.entity";
import {IdeaNetwork} from "../ideaNetwork.entity";
import {IdeaStatus} from "../ideaStatus";

export class IdeaDto {
    @ApiProperty()
    @Allow()
    id!: string

    @ApiProperty()
    @Allow()
    title!: string

    @ApiPropertyOptional()
    @Allow()
    content?: string

    @ApiPropertyOptional()
    @Allow()
    beneficiary?: string

    @ApiPropertyOptional({maxLength: ideaRestrictions.field.maxLength})
    @Allow()
    field?: string

    @ApiProperty({
        type: [IdeaNetworkDto]
    })
    @Allow()
    networks!: IdeaNetworkDto[]

    @ApiPropertyOptional()
    @Allow()
    contact?: string

    @ApiPropertyOptional()
    @Allow()
    portfolio?: string

    @ApiPropertyOptional({
        type: [String]
    })
    @Allow()
    links?: string[]

    @ApiProperty()
    @Allow()
    ordinalNumber: number

    @ApiProperty({enum: IdeaStatus})
    status: IdeaStatus

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

export function toIdeaDto(idea: Idea): IdeaDto {
    return new IdeaDto(
        idea.id,
        idea.title,
        idea.status,
        idea.networks ? idea.networks.map((ideaNetwork: IdeaNetwork) =>
            toIdeaNetworkDto(ideaNetwork)
        ) : [],
        idea.ordinalNumber,
        idea.beneficiary,
        idea.content,
        idea.field,
        idea.contact,
        idea.portfolio,
        idea.links ? JSON.parse(idea.links) as string[] : undefined,
    )
}
