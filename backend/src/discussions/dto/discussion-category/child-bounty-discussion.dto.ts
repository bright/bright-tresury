import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../../utils/network.validator'
import { DiscussionCategory } from '../../entites/discussion-category'
import { DiscussionDto } from '../discussion.dto'

export class ChildBountyDiscussionDto extends DiscussionDto {
    @ApiProperty({
        description: 'Discussion category',
    })
    @IsNotEmpty()
    @IsString()
    category: DiscussionCategory.ChildBounty

    @ApiProperty({ description: 'Network id of the child-bounty' })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    networkId: string

    @ApiProperty({ description: 'Child-bounties index' })
    @IsNotEmpty()
    @IsNumber()
    blockchainIndex: number

    @ApiProperty({ description: 'Child-bounties parent index' })
    @IsNotEmpty()
    @IsNumber()
    parentBountyBlockchainIndex: number

    constructor(
        category: DiscussionCategory.ChildBounty,
        networkId: string,
        blockchainIndex: number,
        parentBountyBlockchainIndex: number,
    ) {
        super(category)
        this.category = category
        this.networkId = networkId
        this.blockchainIndex = blockchainIndex
        this.parentBountyBlockchainIndex = parentBountyBlockchainIndex
    }
}
