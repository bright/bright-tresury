import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MilestoneDetails } from '../../../milestone-details/entities/milestone-details.entity'
import { IdeaMilestone } from '../entities/idea-milestone.entity'
import { IdeaMilestoneNetworkDto } from './idea-milestone-network.dto'
import { Nil } from '../../../utils/types'
import { IdeaMilestoneStatus } from '../entities/idea-milestone-status'

export class IdeaMilestoneDto {
    @ApiProperty({
        description: 'Id of the idea milestone',
    })
    id: string

    @ApiPropertyOptional({
        description: 'Blockchain address of the idea milestone beneficiary',
    })
    beneficiary: Nil<string>

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

    @ApiProperty({
        description: 'Details of the milestone',
        type: [MilestoneDetails],
    })
    details: MilestoneDetails

    constructor({ id, status, networks, beneficiary, details }: IdeaMilestone) {
        this.id = id
        this.status = status
        this.networks = networks.map((network) => new IdeaMilestoneNetworkDto(network))
        this.beneficiary = beneficiary
        this.details = details
    }
}
