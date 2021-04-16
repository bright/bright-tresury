import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IdeaMilestone} from "../entities/idea.milestone.entity";
import {
    IdeaMilestoneNetworkDto,
    mapIdeaMilestoneNetworkEntityToIdeaMilestoneNetworkDto
} from "./ideaMilestoneNetworkDto";

export class IdeaMilestoneDto {
    @ApiProperty({
        description: 'Id from the database'
    })
    id: string

    @ApiProperty({
        description: 'Ordinal number of the milestone'
    })
    ordinalNumber: number

    @ApiProperty({
        description: 'Subject of the milestone'
    })
    subject: string

    @ApiPropertyOptional({
        description: 'Date of start of the milestone'
    })
    dateFrom?: Date

    @ApiPropertyOptional({
        description: 'Date of end of the milestone'
    })
    dateTo?: Date

    @ApiPropertyOptional({
        description: 'Description of the milestone'
    })
    description?: string

    @ApiProperty({
        description: 'Networks of the milestone',
        type: [IdeaMilestoneNetworkDto]
    })
    networks: IdeaMilestoneNetworkDto[]

    constructor(
        id: string,
        ordinalNumber: number,
        subject: string,
        networks: IdeaMilestoneNetworkDto[],
        dateFrom?: Date,
        dateTo?: Date,
        description?: string
    ) {
        this.id = id
        this.ordinalNumber = ordinalNumber
        this.subject = subject
        this.networks = networks
        this.dateFrom = dateFrom
        this.dateTo = dateTo
        this.description = description
    }
}

export const mapIdeaMilestoneEntityToIdeaMilestoneDto = (
    { id, ordinalNumber, subject, networks, dateFrom, dateTo, description }: IdeaMilestone
): IdeaMilestoneDto => {
    const mappedNetworks = networks.map((network) => mapIdeaMilestoneNetworkEntityToIdeaMilestoneNetworkDto(network))
    return new IdeaMilestoneDto(id, ordinalNumber, subject, mappedNetworks, dateFrom, dateTo, description)
}
