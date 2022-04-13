import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../utils/network.validator'
import { Nil } from '../../utils/types'

export class CreateTipDto {
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

    @ApiProperty({ description: 'Blockchain hash of the tip proposal' })
    @IsNotEmpty()
    blockchainHash!: string
}
