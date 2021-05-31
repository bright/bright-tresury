import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
    ArrayMinSize,
    ArrayNotContains,
    IsArray,
    IsEnum,
    IsIn,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    ValidateNested,
} from 'class-validator'
import { ideaRestrictions } from '../entities/idea.entity'
import { IdeaStatus } from '../ideaStatus'
import { Type } from 'class-transformer'
import { CreateIdeaNetworkDto } from './createIdeaNetwork.dto'
import { IsValidAddress } from '../../utils/address/address.validator'

const AllowedIdeaStatuses = [IdeaStatus.Draft, IdeaStatus.Active]

export class CreateIdeaDto {
    @ApiProperty({ description: 'Title of the idea' })
    @IsNotEmpty()
    title!: string

    @ApiPropertyOptional({
        description: 'Reason of the idea',
    })
    @IsOptional()
    content?: string

    @ApiProperty({
        description: 'Blockchain address of the idea beneficiary',
    })
    @IsOptional()
    @IsValidAddress()
    beneficiary?: string

    @ApiPropertyOptional({
        description: 'Field of the idea',
        maxLength: ideaRestrictions.field.maxLength,
    })
    @MaxLength(ideaRestrictions.field.maxLength)
    @IsOptional()
    field?: string

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
        description: 'Contact to the idea proposer',
    })
    @IsOptional()
    contact?: string

    @ApiPropertyOptional({
        description: 'Portfolio of the idea proposer',
    })
    @IsOptional()
    portfolio?: string

    @ApiPropertyOptional({
        description: 'External links connected with the idea',
        type: [String],
    })
    @IsArray()
    @IsOptional()
    @ArrayNotContains(['', null, undefined])
    links?: string[]

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
}
