import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, Validate } from 'class-validator'
import { IsValidAddress } from '../../utils/address/address.validator'
import { IsValidNetworkConstraint } from '../../utils/network.validator'
import { Nil } from '../../utils/types'

export class CreateBountyDto {
    @ApiProperty({ description: 'Title of the bounty proposal' })
    @IsNotEmpty()
    title!: string

    @ApiPropertyOptional({ description: 'Field of the bounty proposal' })
    @IsOptional()
    field?: Nil<string>

    @ApiPropertyOptional({ description: 'Description of the bounty proposal' })
    @IsOptional()
    description?: Nil<string>

    @ApiPropertyOptional({ description: 'Beneficiary of the bounty proposal' })
    @IsOptional()
    @IsValidAddress()
    beneficiary?: Nil<string>

    @ApiProperty({ description: 'Network in which the bounty is proposed' })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    networkId!: string

    @ApiProperty({ description: 'Blockchain index of the bounty proposal' })
    @IsNotEmpty()
    blockchainIndex!: number

    constructor(
        title: string,
        field: Nil<string>,
        description: Nil<string>,
        beneficiary: Nil<string>,
        networkId: string,
        blockchainIndex: number,
    ) {
        this.title = title
        this.field = field
        this.description = description
        this.beneficiary = beneficiary
        this.networkId = networkId
        this.blockchainIndex = blockchainIndex
    }
}
