import { ApiProperty } from '@nestjs/swagger'
import { MilestoneDetails } from '../../../milestone-details/entities/milestone-details.entity'
import { ProposalMilestone } from '../entities/proposal-milestone.entity'

export class ProposalMilestoneDto {
    @ApiProperty({
        description: 'Id of the proposal milestone',
    })
    id: string

    @ApiProperty({
        description: 'Details of the milestone',
        type: MilestoneDetails,
    })
    details: MilestoneDetails

    constructor({ id, details }: ProposalMilestone) {
        this.id = id
        this.details = details
    }
}
