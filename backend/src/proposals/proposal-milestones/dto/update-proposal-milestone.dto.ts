import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { UpdateMilestoneDetailsDto } from '../../../milestone-details/dto/update-milestone-details.dto'

export class UpdateProposalMilestoneDto {
    @ApiPropertyOptional({
        description: 'Details of the milestone',
        type: [UpdateMilestoneDetailsDto],
    })
    @ValidateNested({ each: true })
    @Type(() => UpdateMilestoneDetailsDto)
    details?: UpdateMilestoneDetailsDto
}
