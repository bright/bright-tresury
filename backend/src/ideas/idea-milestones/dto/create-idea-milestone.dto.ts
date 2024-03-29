import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ArrayMinSize, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateMilestoneDetailsDto } from '../../../milestone-details/dto/create-milestone-details.dto'
import { TransformAddress } from '../../../utils/address/address.transform'
import { Nil } from '../../../utils/types'
import { CreateIdeaMilestoneNetworkDto } from './create-idea-milestone-network.dto'
import { IsValidAddress } from '../../../utils/address/address.validator'

export class CreateIdeaMilestoneDto {
    @ApiPropertyOptional({
        description: 'Blockchain address of the idea milestone beneficiary',
    })
    @IsOptional()
    @IsValidAddress()
    @TransformAddress()
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
