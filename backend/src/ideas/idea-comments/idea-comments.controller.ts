import { Body, Delete, Get, HttpStatus, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common'
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
import { IdeaCommentDto } from './dto/idea-comment.dto'
import { CreateIdeaCommentDto } from './dto/create-idea-comment.dto'
import { IdeaCommentsService } from './idea-comments.service'
import { getLogger } from '../../logging.module'
import { IdeaDto } from '../dto/idea.dto'
import { UpdateIdeaDto } from '../dto/update-idea.dto'
import { UpdateIdeaCommentDto } from './dto/update-idea-comment.dto'

const logger = getLogger()

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
    async getAll(@Param('ideaId') ideaId: string): Promise<IdeaCommentDto[]> {
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
        logger.info(`Creating new idea comment for idea: ${ideaId}...`)
        const ideaComment = await this.ideaCommentsService.create(ideaId, session.user, createIdeaCommentDto)
        return new IdeaCommentDto(ideaComment)
    }

    @ApiOkResponse({
        description: 'Patched idea comment.',
        type: IdeaCommentDto,
    })
    @ApiBadRequestResponse({
        description: 'Comment content must not be empty.',
    })
    @ApiNotFoundResponse({
        description: 'Either idea not found or idea comment not found',
    })
    @Patch(':commentId')
    @UseGuards(SessionGuard)
    async update(
        @Param('ideaId') ideaId: string,
        @Param('commentId') commentId: string,
        @Body() updateIdeaCommentDto: UpdateIdeaCommentDto,
        @ReqSession() session: SessionData,
    ): Promise<IdeaCommentDto> {
        logger.info(`Updating idea comment ${commentId}...`, updateIdeaCommentDto)
        const ideaComment = await this.ideaCommentsService.update(ideaId, commentId, updateIdeaCommentDto, session.user)
        return new IdeaCommentDto(ideaComment)
    }

    @ApiOkResponse({
        description: 'Deleted idea comment.',
    })
    @ApiNotFoundResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'No idea found or no idea comment found.',
    })
    @Delete(':commentId')
    @UseGuards(SessionGuard)
    async delete(
        @Param('ideaId') ideaId: string,
        @Param('commentId') commentId: string,
        @ReqSession() session: SessionData,
    ) {
        logger.info(`Deleting idea comment ${commentId}...`)
        await this.ideaCommentsService.delete(ideaId, commentId, session.user)
    }
}
