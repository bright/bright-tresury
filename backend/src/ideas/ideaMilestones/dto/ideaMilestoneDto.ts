import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IdeaMilestone } from '../entities/idea.milestone.entity'
import { IdeaMilestoneNetworkDto } from './ideaMilestoneNetworkDto'
import { Nil } from '../../../utils/types'
import { IdeaMilestoneStatus } from '../ideaMilestoneStatus'

export class IdeaMilestoneDto {
    @ApiProperty({
        description: 'Id of the idea milestone',
    })
    id: string

    @ApiProperty({
        description: 'Ordinal number of the milestone',
    })
    ordinalNumber: number

    @ApiProperty({
        description: 'Subject of the milestone',
    })
    subject: string

    @ApiPropertyOptional({
        description: 'Blockchain address of the idea milestone beneficiary',
    })
    beneficiary: Nil<string>

    @ApiPropertyOptional({
        description: 'Date of start of the milestone',
        type: Date,
    })
    dateFrom: Nil<Date>

    @ApiPropertyOptional({
        description: 'Date of end of the milestone',
        type: Date,
    })
    dateTo: Nil<Date>

    @ApiPropertyOptional({
        description: 'Description of the milestone',
    })
    description: Nil<string>

    @ApiProperty({
        description: 'Networks of the milestone',
        type: [IdeaMilestoneNetworkDto],
    })
    networks: IdeaMilestoneNetworkDto[]

    @ApiProperty({
        description: 'Status of the milestone',
        enum: IdeaMilestoneStatus,
    })
    status: IdeaMilestoneStatus

    constructor({
        id,
        ordinalNumber,
        subject,
        status,
        networks,
        beneficiary,
        dateFrom,
        dateTo,
        description,
    }: IdeaMilestone) {
        this.id = id
        this.ordinalNumber = ordinalNumber
        this.subject = subject
        this.status = status
        this.networks = networks.map((network) => new IdeaMilestoneNetworkDto(network))
        this.beneficiary = beneficiary
        this.dateFrom = dateFrom
        this.dateTo = dateTo
        this.description = description
    }
}
