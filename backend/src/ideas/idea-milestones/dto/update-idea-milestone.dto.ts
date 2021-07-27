import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { UpdateMilestoneDetailsDto } from '../../../milestone-details/dto/update-milestone-details.dto'
import { CreateIdeaMilestoneDto } from './create-idea-milestone.dto'

export class UpdateIdeaMilestoneDto extends PartialType(OmitType(CreateIdeaMilestoneDto, ['details'] as const)) {
    @ApiPropertyOptional({
        description: 'Details of the milestone',
        type: [UpdateMilestoneDetailsDto],
    })
    @ValidateNested({ each: true })
    @Type(() => UpdateMilestoneDetailsDto)
    details?: UpdateMilestoneDetailsDto
}
