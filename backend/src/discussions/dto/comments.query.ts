import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../utils/network.validator'
import { DiscussionCategory } from '../entites/discussion-category'

export class CommentsQuery {
    @ApiProperty({
        description: 'Discussion category',
    })
    @IsNotEmpty()
    @IsEnum(DiscussionCategory)
    category!: DiscussionCategory

    @ApiPropertyOptional({ description: 'Network id of the blockchain entity' })
    @IsOptional()
    @Validate(IsValidNetworkConstraint)
    networkId?: string

    @ApiPropertyOptional({ description: 'Blockchain index of the blockchain entity' })
    @IsOptional()
    @IsNumberString()
    blockchainIndex?: string

    @ApiPropertyOptional({ description: 'Id of the database entity' })
    @IsOptional()
    @IsUUID()
    entityId?: string

    @ApiPropertyOptional({ description: 'Blockchain hash of the blockchain entity' })
    @IsOptional()
    @IsString()
    blockchainHash?: string

    @ApiPropertyOptional({ description: 'Blockchain index of the parent bounty blockchain entity' })
    @IsOptional()
    @IsNumberString()
    parentBountyBlockchainIndex?: string
}
