import {ApiProperty} from "@nestjs/swagger";
import {IdeaMilestone} from "../entities/idea.milestone.entity";
import {
    IdeaMilestoneNetworkDto,
    mapIdeaMilestoneNetworkEntityToIdeaMilestoneNetworkDto
} from "./ideaMilestoneNetworkDto";

export class IdeaMilestoneDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    ordinalNumber: number

    @ApiProperty()
    subject: string

    @ApiProperty()
    dateFrom?: Date | null

    @ApiProperty()
    dateTo?: Date | null

    @ApiProperty()
    description?: string | null

    @ApiProperty({
        type: [IdeaMilestoneNetworkDto]
    })
    networks: IdeaMilestoneNetworkDto[]

    constructor(
        id: string,
        ordinalNumber: number,
        subject: string,
        networks: IdeaMilestoneNetworkDto[],
        dateFrom?: Date | null,
        dateTo?: Date | null,
        description?: string | null
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
