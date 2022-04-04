import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { DiscussionCategory } from '../entites/discussion-category'
import { BountyDiscussionDto } from './discussion-category/bounty-discussion.dto'
import { IdeaDiscussionDto } from './discussion-category/idea-discussion.dto'
import { ProposalDiscussionDto } from './discussion-category/proposal-discussion.dto'
import { DiscussionDto } from './discussion.dto'

export class CreateCommentDto {
    @ApiProperty({
        description: 'Comment content',
    })
    @IsNotEmpty()
    @IsString()
    content: string

    @ValidateNested()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DiscussionDto, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'category',
            subTypes: [
                { name: DiscussionCategory.Bounty, value: BountyDiscussionDto },
                { name: DiscussionCategory.Proposal, value: ProposalDiscussionDto },
                { name: DiscussionCategory.Idea, value: IdeaDiscussionDto },
            ],
        },
    })
    discussionDto: DiscussionDto

    constructor(content: string, discussionDto: DiscussionDto) {
        this.content = content
        this.discussionDto = discussionDto
    }
}