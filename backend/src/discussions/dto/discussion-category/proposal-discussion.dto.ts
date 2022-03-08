import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../../utils/network.validator'
import { DiscussionCategory } from '../../entites/discussion-category'
import { DiscussionDto } from '../discussion.dto'

export class ProposalDiscussionDto extends DiscussionDto {
    @ApiProperty({
        description: 'Discussion category',
    })
    @IsNotEmpty()
    @IsString()
    category: DiscussionCategory.Proposal

    @ApiProperty({ description: 'Network id of the proposal' })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    networkId: string

    @ApiProperty({ description: 'Blockchain index of the proposal' })
    @IsNotEmpty()
    @IsNumber()
    blockchainIndex: number

    constructor(category: DiscussionCategory.Proposal, networkId: string, blockchainIndex: number) {
        super(category)
        this.category = category
        this.networkId = networkId
        this.blockchainIndex = blockchainIndex
    }
}
