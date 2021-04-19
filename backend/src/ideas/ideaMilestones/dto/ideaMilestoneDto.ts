import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IdeaMilestone} from "../entities/idea.milestone.entity";
import {
    IdeaMilestoneNetworkDto,
    mapIdeaMilestoneNetworkEntityToIdeaMilestoneNetworkDto
} from "./ideaMilestoneNetworkDto";
import {Nil} from "../../../utils/types";

export class IdeaMilestoneDto {
    @ApiProperty({
        description: 'Id of the idea milestone'
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
        description: 'Date of start of the milestone',
        type: Date
    })
    dateFrom: Nil<Date>

    @ApiPropertyOptional({
        description: 'Date of end of the milestone',
        type: Date
    })
    dateTo: Nil<Date>

    @ApiPropertyOptional({
        description: 'Description of the milestone'
    })
    description: Nil<string>

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
        dateFrom: Nil<Date>,
        dateTo: Nil<Date>,
        description: Nil<string>
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
