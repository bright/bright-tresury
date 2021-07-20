import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { UpdateIdeaProposalDetailsDto } from '../../idea-proposal-details/dto/update-idea-proposal-details.dto'
import { CreateIdeaDto } from './create-idea.dto'

export class UpdateIdeaDto extends PartialType(OmitType(CreateIdeaDto, ['details'] as const)) {
    @ApiPropertyOptional({
        description: 'Details of the idea',
        type: [UpdateIdeaProposalDetailsDto],
    })
    @ValidateNested({ each: true })
    @Type(() => UpdateIdeaProposalDetailsDto)
    details?: UpdateIdeaProposalDetailsDto
}
