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
import { CommentDto } from '../../comments/dto/comment.dto'
import { CreateCommentDto } from '../../comments/dto/create-comment.dto'
import { IdeaCommentsService } from './idea-comments.service'
import { getLogger } from '../../logging.module'
import { UpdateCommentDto } from '../../comments/dto/update-comment.dto'

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
    async getAll(@Param('ideaId') ideaId: string): Promise<CommentDto[]> {
        const ideaComments = await this.ideaCommentsService.findAll(ideaId)
        return ideaComments.map(({ comment }) => new CommentDto(comment))
    }

    @Post()
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiCreatedResponse({
        description: 'New idea comment created.',
        type: CommentDto,
    })
    @ApiNotFoundResponse({
        description: 'Idea with the given id not found.',
    })
    @UseGuards(SessionGuard)
    async create(
        @Param('ideaId') ideaId: string,
        @Body() createCommentDto: CreateCommentDto,
        @ReqSession() session: SessionData,
    ): Promise<CommentDto> {
        logger.info(`Creating new idea comment for idea: ${ideaId}...`)
        const { comment } = await this.ideaCommentsService.create(ideaId, session.user, createCommentDto)
        return new CommentDto(comment)
    }

    @ApiOkResponse({
        description: 'Patched idea comment.',
        type: CommentDto,
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
        @Body() updateCommentDto: UpdateCommentDto,
        @ReqSession() session: SessionData,
    ): Promise<CommentDto> {
        logger.info(`Updating idea comment ${commentId}...`, updateCommentDto)
        const { comment } = await this.ideaCommentsService.update(ideaId, commentId, updateCommentDto, session.user)
        return new CommentDto(comment)
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
        const { comment } = await this.ideaCommentsService.delete(ideaId, commentId, session.user)
        await new CommentDto(comment)
    }
}
