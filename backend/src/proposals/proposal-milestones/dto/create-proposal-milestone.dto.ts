import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { CreateMilestoneDetailsDto } from '../../../milestone-details/dto/create-milestone-details.dto'

export class CreateProposalMilestoneDto {
    @ApiProperty({
        description: 'Details of the milestone',
        type: CreateMilestoneDetailsDto,
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateMilestoneDetailsDto)
    details!: CreateMilestoneDetailsDto
}
