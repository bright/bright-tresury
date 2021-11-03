import { ApiProperty } from '@nestjs/swagger'
import { MilestoneDetailsEntity } from '../../../milestone-details/entities/milestone-details.entity'
import { ProposalMilestoneEntity } from '../entities/proposal-milestone.entity'

export class ProposalMilestoneDto {
    @ApiProperty({
        description: 'Id of the proposal milestone',
    })
    id: string

    @ApiProperty({
        description: 'Details of the milestone',
        type: MilestoneDetailsEntity,
    })
    details: MilestoneDetailsEntity

    constructor({ id, details }: ProposalMilestoneEntity) {
        this.id = id
        this.details = details
    }
}
