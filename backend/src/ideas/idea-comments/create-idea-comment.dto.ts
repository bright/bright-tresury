import { IdeaCommentDto } from './idea-comment.dto'
import { PartialType } from '@nestjs/swagger'

export class CreateIdeaCommentDto extends PartialType(IdeaCommentDto) {}
