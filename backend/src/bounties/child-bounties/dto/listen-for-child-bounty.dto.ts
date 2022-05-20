import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, Validate } from 'class-validator'
import { Nil } from '../../../utils/types'
import { IsValidNetworkConstraint } from '../../../utils/network.validator'

export class ListenForChildBountyDto {
    @ApiProperty({ description: 'Title of the bounty proposal' })
    @IsNotEmpty()
    title!: string

    @ApiPropertyOptional({ description: 'Description of the bounty proposal' })
    @IsOptional()
    description?: Nil<string>

    @ApiProperty({ description: 'Network in which the bounty is proposed' })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    networkId!: string

    @ApiProperty({ description: 'Hash of extrinsic which creates bounty proposal' })
    @IsNotEmpty()
    extrinsicHash!: string

    @ApiProperty({ description: 'Hash of last seen block' })
    @IsNotEmpty()
    lastBlockHash!: string
}
