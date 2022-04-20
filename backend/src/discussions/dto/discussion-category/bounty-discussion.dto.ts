import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../../utils/network.validator'
import { DiscussionCategory } from '../../entites/discussion-category'
import { DiscussionDto } from '../discussion.dto'

export class BountyDiscussionDto extends DiscussionDto {
    @ApiProperty({
        description: 'Discussion category',
    })
    @IsNotEmpty()
    @IsString()
    category: DiscussionCategory.Bounty = DiscussionCategory.Bounty

    @ApiProperty({ description: 'Network id of the bounty' })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    networkId: string

    @ApiProperty({ description: 'Blockchain index of the bounty' })
    @IsNotEmpty()
    @IsNumber()
    blockchainIndex: number

    constructor(category: DiscussionCategory.Bounty, networkId: string, blockchainIndex: number) {
        super(category)

        this.networkId = networkId
        this.blockchainIndex = blockchainIndex
    }
}
