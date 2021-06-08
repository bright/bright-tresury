import { PartialType } from '@nestjs/swagger'
import { CreateIdeaMilestoneDto } from './create-idea-milestone.dto'

export class UpdateIdeaMilestoneDto extends PartialType(CreateIdeaMilestoneDto) {}
