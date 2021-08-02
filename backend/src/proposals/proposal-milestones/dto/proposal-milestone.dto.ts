import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MilestoneDetails } from '../../../milestone-details/entities/milestone-details.entity'
import { Nil } from '../../../utils/types'
import { ProposalMilestone } from '../entities/proposal-milestone.entity'

export class ProposalMilestoneDto {
    @ApiProperty({
        description: 'Id of the proposal milestone',
    })
    id: string

    @ApiProperty({
        description: 'Ordinal number of the milestone',
    })
    ordinalNumber: number

    @ApiPropertyOptional({
        description: 'Blockchain address of the proposal milestone beneficiary',
    })
    beneficiary: Nil<string>

    @ApiProperty({
        description: 'Details of the milestone',
        type: [MilestoneDetails],
    })
    details: MilestoneDetails

    constructor({ id, ordinalNumber, details }: ProposalMilestone) {
        this.id = id
        this.ordinalNumber = ordinalNumber
        this.details = details
    }
}
