import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsArray, IsNotEmpty} from "class-validator";
import {IdeaNetworkDto} from "./ideaNetworkDto";
import {Idea, ideaRestrictions} from "../idea.entity";
import {IdeaNetwork} from "../ideaNetwork.entity";

export class IdeaDto {
    @ApiProperty()
    id!: string

    @ApiProperty()
    @IsNotEmpty()
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
    @IsArray()
    links?: string[]

    constructor(
        id: string,
        title: string,
        networks: IdeaNetworkDto[],
        beneficiary?: string,
        content?: string,
        field?: string,
        contact?: string,
        portfolio?: string,
        links?: string[]
    ) {
        this.id = id
        this.title = title
        this.content = content
        this.beneficiary = beneficiary
        this.field = field
        this.networks = networks
        this.contact = contact
        this.portfolio = portfolio
        this.links = links
    }

}

export function toIdeaDto(idea: Idea): IdeaDto {
    return new IdeaDto(
        idea.id,
        idea.title,
        idea.networks ? idea.networks.map((ideaNetwork: IdeaNetwork) => new IdeaNetworkDto(
            ideaNetwork.name,
            ideaNetwork.value,
            ideaNetwork.id
        )) : [],
        idea.beneficiary,
        idea.content,
        idea.field,
        idea.contact,
        idea.portfolio,
        idea.links ? JSON.parse(idea.links) as string[] : undefined
    )
}
