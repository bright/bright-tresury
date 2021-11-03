import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString, IsOptional, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../utils/network.validator'
import { Nil } from '../../utils/types'

export class CreateBountyDto {
    @ApiProperty({ description: 'Description of the bounty proposal stored on-chain' })
    @IsNotEmpty()
    blockchainDescription!: string

    @ApiProperty({ description: 'Value of the bounty proposal in plancks' })
    @IsNotEmpty()
    @IsNumberString({ no_symbols: true })
    value!: string

    @ApiProperty({ description: 'Title of the bounty proposal' })
    @IsNotEmpty()
    title!: string

    @ApiPropertyOptional({ description: 'Field of the bounty proposal' })
    @IsOptional()
    field?: Nil<string>

    @ApiPropertyOptional({ description: 'Description of the bounty proposal' })
    @IsOptional()
    description?: Nil<string>

    @ApiProperty({ description: 'Network in which the bounty is proposed' })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    networkId!: string

    @ApiProperty({ description: 'Proposer of the bounty' })
    @IsNotEmpty()
    proposer!: string

    @ApiProperty({ description: 'Hash of extrinsic which creates bounty proposal' })
    @IsNotEmpty()
    extrinsicHash!: string

    @ApiProperty({ description: 'Hash of last seen block' })
    @IsNotEmpty()
    lastBlockHash!: string

    @ApiPropertyOptional({ description: 'Blockchain index of the bounty proposal' })
    @IsOptional()
    blockchainIndex?: Nil<number>
}
