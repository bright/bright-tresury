import { Body, Get, Inject, Param, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'

import { SessionGuard } from '../../auth/session/guard/session.guard'
import { IdeaCommentDto } from './dto/idea-comment.dto'
import { CreateIdeaCommentDto } from './dto/create-idea-comment.dto'
import { IdeaCommentsService } from './idea-comments.service'

@ControllerApiVersion('/ideas/:ideaId/comments', ['v1'])
@ApiTags('ideas.comments')
export class IdeaCommentsController {
    constructor(
        @Inject(IdeaCommentsService)
        private readonly ideaCommentsService: IdeaCommentsService,
    ) {}

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
    async getComments(@Param('ideaId') ideaId: string): Promise<IdeaCommentDto[]> {
        const ideaComments = await this.ideaCommentsService.findAll(ideaId)
        return ideaComments.map((ideaComment) => new IdeaCommentDto(ideaComment))
    }

    @Post()
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiCreatedResponse({
        description: 'New idea comment created.',
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
        const ideaComment = await this.ideaCommentsService.create(ideaId, session.user, createIdeaCommentDto)
        return new IdeaCommentDto(ideaComment)
    }
}
