import { Body, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../auth/guards/session.guard'
import { ReqSession, SessionData } from '../auth/session/session.decorator'
import { getLogger } from '../logging.module'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { CommentsService } from './comments.service'
import { DiscussionsService } from './discussions.service'
import { CommentDto } from './dto/comment.dto'
import { CommentsQuery } from './dto/comments.query'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { DiscussionEntity } from './entites/discussion.entity'

const logger = getLogger()

@ControllerApiVersion('/comments', ['v1'])
@ApiTags('comments')
export class CommentsController {
    constructor(
        private readonly discussionsService: DiscussionsService,
        private readonly commentsService: CommentsService,
    ) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with comments.',
        type: [CommentDto],
    })
    async get(@Query() query: CommentsQuery): Promise<CommentDto[]> {
        logger.info(`Getting comments for`, query)

        const whereQuery =
            query.blockchainIndex === undefined ? query : { ...query, blockchainIndex: Number(query.blockchainIndex) }

        // we have mapped the query to conform Partial<DiscussionEntity> interface
        const comments = await this.discussionsService.findComments(whereQuery as Partial<DiscussionEntity>)
        return comments.map((comment) => new CommentDto(comment))
    }

    @Post()
    @ApiCreatedResponse({
        description: 'New comment created.',
        type: CommentDto,
    })
    @UseGuards(SessionGuard)
    async create(@Body() dto: CreateCommentDto, @ReqSession() session: SessionData): Promise<CommentDto> {
        logger.info(`Creating a comment with user`, dto, session.user)
        const comment = await this.discussionsService.addComment(dto, session.user)
        return new CommentDto(comment)
    }

    @Patch('/:id')
    @ApiOkResponse({
        description: 'Comment updated.',
        type: CommentDto,
    })
    @ApiNotFoundResponse({ description: 'Comment with the given id does not exist' })
    @UseGuards(SessionGuard)
    async update(
        @Param() { id }: { id: string },
        @Body() dto: UpdateCommentDto,
        @ReqSession() session: SessionData,
    ): Promise<CommentDto> {
        logger.info(`Updating a comment ${id} with user`, dto, session.user)
        const comment = await this.commentsService.update(id, dto, session.user)
        return new CommentDto(comment)
    }

    @Delete('/:id')
    @ApiOkResponse({
        description: 'Comment deleted.',
    })
    @ApiNotFoundResponse({ description: 'Comment with the given id does not exist' })
    @UseGuards(SessionGuard)
    async delete(@Param() { id }: { id: string }, @ReqSession() session: SessionData): Promise<void> {
        logger.info(`Deleting a comment ${id} with user`, session.user)
        return this.commentsService.delete(id, session.user)
    }
}
