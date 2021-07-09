import { PartialType } from '@nestjs/swagger'
import { CreateIdeaProposalDetailsDto } from './create-idea-proposal-details.dto'

export class UpdateIdeaProposalDetailsDto extends PartialType(CreateIdeaProposalDetailsDto) {}
