import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../../utils/network.validator'
import { Nil } from '../../../utils/types'

export class CreateChildBountyDto {
    @ApiProperty({ description: 'Title of the child bounty proposal' })
    @IsNotEmpty()
    title!: string

    @ApiPropertyOptional({ description: 'Description of the child bounty' })
    @IsOptional()
    description?: Nil<string>

    @ApiProperty({ description: 'Network in which the bounty is proposed' })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    networkId!: string

    @ApiProperty({ description: 'Blockchain index of the child bounty proposal' })
    @IsNotEmpty()
    blockchainIndex!: number

    @ApiProperty({ description: 'Blockchain index of the parent bounty proposal' })
    @IsNotEmpty()
    parentBountyBlockchainIndex!: number

    constructor(
        title: string,
        description: Nil<string>,
        networkId: string,
        blockchainIndex: number,
        parentBountyBlockchainIndex: number,
    ) {
        this.title = title
        this.description = description
        this.networkId = networkId
        this.blockchainIndex = blockchainIndex
        this.parentBountyBlockchainIndex = parentBountyBlockchainIndex
    }
}
