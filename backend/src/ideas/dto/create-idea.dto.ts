import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ArrayMinSize, IsEnum, IsIn, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { CreateIdeaProposalDetailsDto } from '../../idea-proposal-details/dto/create-idea-proposal-details.dto'
import { IsValidAddress } from '../../utils/address/address.validator'
import { IdeaStatus } from '../idea-status'
import { CreateIdeaNetworkDto } from './create-idea-network.dto'

const AllowedIdeaStatuses = [IdeaStatus.Draft, IdeaStatus.Active]

export class CreateIdeaDto {
    @ApiProperty({
        description: 'Blockchain address of the idea beneficiary',
    })
    @IsOptional()
    @IsValidAddress()
    beneficiary?: string

    @ApiProperty({
        description: 'Networks of the idea',
        type: [CreateIdeaNetworkDto],
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateIdeaNetworkDto)
    @ArrayMinSize(1)
    networks!: CreateIdeaNetworkDto[]

    @ApiPropertyOptional({
        description: 'Status of the idea',
        enum: IdeaStatus,
        oneOf: AllowedIdeaStatuses.map((status: IdeaStatus) => {
            return { type: status }
        }),
    })
    @IsOptional()
    @IsEnum(IdeaStatus)
    @IsIn(AllowedIdeaStatuses)
    status?: IdeaStatus

    @ApiProperty({
        description: 'Details of the idea',
        type: [CreateIdeaProposalDetailsDto],
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateIdeaProposalDetailsDto)
    details!: CreateIdeaProposalDetailsDto
}
