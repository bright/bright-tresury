import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { UpdateIdeaProposalDetailsDto } from '../../idea-proposal-details/dto/update-idea-proposal-details.dto'
import { CreateIdeaDto } from './create-idea.dto'

export class UpdateIdeaDto extends PartialType(OmitType(CreateIdeaDto, ['details'] as const)) {
    @ApiProperty({
        description: 'Details of the idea',
        type: [UpdateIdeaProposalDetailsDto],
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateIdeaProposalDetailsDto)
    details?: UpdateIdeaProposalDetailsDto
}
