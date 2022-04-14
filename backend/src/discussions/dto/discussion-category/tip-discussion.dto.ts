import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Validate } from 'class-validator'
import { IsValidNetworkConstraint } from '../../../utils/network.validator'
import { DiscussionCategory } from '../../entites/discussion-category'
import { DiscussionDto } from '../discussion.dto'

export class TipDiscussionDto extends DiscussionDto {
    @ApiProperty({
        description: 'Discussion category',
    })
    @IsNotEmpty()
    @IsString()
    category: DiscussionCategory.Tip

    @ApiProperty({ description: 'Network id of the tip' })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    networkId: string

    @ApiProperty({ description: 'Blockchain hash of the tip' })
    @IsNotEmpty()
    @IsString()
    blockchainHash: string

    constructor(category: DiscussionCategory.Tip, networkId: string, blockchainHash: string) {
        super(category)
        this.category = category
        this.networkId = networkId
        this.blockchainHash = blockchainHash
    }
}
