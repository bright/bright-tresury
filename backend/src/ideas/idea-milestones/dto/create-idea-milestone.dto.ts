import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ArrayMinSize, IsISO8601, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateIdeaProposalDetailsDto } from '../../../idea-proposal-details/dto/create-idea-proposal-details.dto'
import { CreateMilestoneDetailsDto } from '../../../milestone-details/dto/create-milestone-details.dto'
import { Nil } from '../../../utils/types'
import { CreateIdeaMilestoneNetworkDto } from './create-idea-milestone-network.dto'
import { IsValidAddress } from '../../../utils/address/address.validator'

export class CreateIdeaMilestoneDto {
    @ApiPropertyOptional({
        description: 'Blockchain address of the idea milestone beneficiary',
    })
    @IsOptional()
    @IsValidAddress()
    beneficiary?: Nil<string>

    @ApiProperty({
        description: 'Networks of the milestone',
        type: [CreateIdeaMilestoneNetworkDto],
    })
    @Type(() => CreateIdeaMilestoneNetworkDto)
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    networks!: CreateIdeaMilestoneNetworkDto[]

    @ApiProperty({
        description: 'Details of the milestone',
        type: [CreateMilestoneDetailsDto],
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateMilestoneDetailsDto)
    details!: CreateMilestoneDetailsDto
}
