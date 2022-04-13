import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../utils/network.validator'
import { Nil } from '../../utils/types'

export class ListenForTipDto {
    @ApiProperty({ description: 'Reason of the tip proposal stored on-chain' })
    @IsNotEmpty()
    blockchainReason!: string

    @ApiProperty({ description: 'Title of the tip' })
    @IsNotEmpty()
    title!: string

    @ApiPropertyOptional({ description: 'Description of the tip' })
    @IsOptional()
    description?: Nil<string>

    @ApiProperty({ description: 'Network in which the tip is proposed' })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    networkId!: string

    @ApiProperty({ description: 'Beneficiary of the tip' })
    @IsNotEmpty()
    beneficiary!: string

    @ApiProperty({ description: 'Finder of the tip' })
    @IsNotEmpty()
    finder!: string

    @ApiProperty({ description: 'Hash of extrinsic which creates tip proposal' })
    @IsNotEmpty()
    extrinsicHash!: string

    @ApiProperty({ description: 'Hash of last seen block' })
    @IsNotEmpty()
    lastBlockHash!: string
}
