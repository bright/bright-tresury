import { PartialType } from '@nestjs/swagger'
import { CreateMilestoneDetailsDto } from './create-milestone-details.dto'

export class UpdateMilestoneDetailsDto extends PartialType(CreateMilestoneDetailsDto) {}
