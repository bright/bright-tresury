import { Body, Get, Param, Post, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'

import { SessionGuard } from '../../auth/session/guard/session.guard'
import { IdeaCommentDto } from './idea-comment.dto'
import { CreateIdeaCommentDto } from './create-idea-comment.dto'

@ControllerApiVersion('/ideas/:ideaId/comments', ['v1'])
@ApiTags('ideas.comments')
export class IdeaCommentsController {
    private COMMENTS = [
        {
            id: 'comment_1',
            userId: 'Sasha_Moshito_id',
            username: 'Sasha_Moshito',
            timestamp: Date.now() - 1000 * 60 * 2,
            thumbsUpCount: 4,
            thumbsDownCount: 2,
            content:
                'Dear Farah, thank you for asking. I think the idea is brilliant, however needs some clarification. Please let me know if you have someone who will help you in developing the project? What are the threads if the project is not developed well?',
        },
        {
            id: 'comment_2',
            userId: 'Farah_id',
            username: 'Farah',
            timestamp: Date.now() - 1000 * 60 * 12,
            thumbsUpCount: 1,
            thumbsDownCount: 0,
            content:
                '@Sasha_Moshito could you please look at my idea for the proposal and let me know it is worth doing it and if it is an interesting topic to develop?',
        },
    ] as IdeaCommentDto[]
    @Get()
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiOkResponse({
        description: 'Respond with idea discussion.',
        type: [Array],
    })
    @ApiNotFoundResponse({
        description: 'Idea with the given id not found.',
    })
    async getComments(@Param('ideaId') ideaId: string, @ReqSession() session: SessionData): Promise<any[]> {
        return this.COMMENTS
    }

    @Post()
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiCreatedResponse({
        description: 'New comment created.',
        type: IdeaCommentDto,
    })
    @ApiNotFoundResponse({
        description: 'Idea with the given id not found.',
    })
    @UseGuards(SessionGuard)
    async create(
        @Param('ideaId') ideaId: string,
        @Body() createIdeaCommentDto: CreateIdeaCommentDto,
        @ReqSession() session: SessionData,
    ): Promise<IdeaCommentDto> {
        this.COMMENTS.push({
            userId: session.user.id,
            username: session.user.username || session.user.email,
            timestamp: Date.now(),
            thumbsUpCount: Math.floor(Math.random() * 100),
            thumbsDownCount: Math.floor(Math.random() * 100),
            content: createIdeaCommentDto.content,
        } as IdeaCommentDto)
        return this.COMMENTS[this.COMMENTS.length - 1]
    }
}
