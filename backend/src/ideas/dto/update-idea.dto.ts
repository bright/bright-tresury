import { PartialType } from '@nestjs/swagger'
import { CreateIdeaDto } from './create-idea.dto'

export class UpdateIdeaDto extends PartialType(CreateIdeaDto) {}
