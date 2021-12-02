import { Body, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../../auth/guards/session.guard'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'
import { CommentDto } from '../../comments/dto/comment.dto'
import { CreateCommentDto } from '../../comments/dto/create-comment.dto'
import { UpdateCommentDto } from '../../comments/dto/update-comment.dto'
import { CommentParam } from '../../comments/params/comment.param'
import { getLogger } from '../../logging.module'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { NetworkNameQuery } from '../../utils/network-name.query'
import { BountyParam } from '../bounty.param'
import { BountyCommentsService } from './bounty-comments.service'

const logger = getLogger()

@ControllerApiVersion('/bounties/:bountyIndex/comments', ['v1'])
@ApiTags('bounties.comments')
export class BountyCommentsController {
    constructor(private readonly service: BountyCommentsService) {}

    @Get()
    @ApiOkResponse({
        description: 'Responds with comments for a bounty.',
        type: [CommentDto],
    })
    @ApiNotFoundResponse({
        description: 'Bounty with the given id within given network not found.',
    })
    async getAll(
        @Param() { bountyIndex }: BountyParam,
        @Query() { network }: NetworkNameQuery,
        @ReqSession() session: SessionData,
    ): Promise<CommentDto[]> {
        logger.info(`Creating new comment for bounty with index ${bountyIndex} and network ${network}`)
        const comments = await this.service.findAll(Number(bountyIndex), network)
        return comments.map(({ comment }) => new CommentDto(comment))
    }

    @Post()
    @ApiCreatedResponse({
        description: 'New bounty comment created.',
        type: CommentDto,
    })
    @ApiNotFoundResponse({
        description: 'Bounty with the given id within given network not found.',
    })
    @UseGuards(SessionGuard)
    async create(
        @Param() { bountyIndex }: BountyParam,
        @Query() { network }: NetworkNameQuery,
        @Body() dto: CreateCommentDto,
        @ReqSession() session: SessionData,
    ): Promise<CommentDto> {
        logger.info(`Creating new comment for bounty with index ${bountyIndex} and network ${network}`)
        const { comment } = await this.service.create(Number(bountyIndex), network, dto, session.user)
        return new CommentDto(comment)
    }

    @Patch('/:commentId')
    @ApiOkResponse({
        description: 'Bounty comment updated.',
        type: CommentDto,
    })
    @ApiNotFoundResponse({
        description: 'Bounty with the given id within given network not found or a comment for a bounty not found',
    })
    @UseGuards(SessionGuard)
    async update(
        @Param() { bountyIndex }: BountyParam,
        @Param() { commentId }: CommentParam,
        @Query() { network }: NetworkNameQuery,
        @Body() dto: UpdateCommentDto,
        @ReqSession() session: SessionData,
    ): Promise<CommentDto> {
        logger.info(`Updating comment ${commentId} for bounty with index ${bountyIndex} and network ${network}`)
        const { comment } = await this.service.update(Number(bountyIndex), network, commentId, dto, session.user)
        return new CommentDto(comment)
    }

    @Delete('/:commentId')
    @ApiOkResponse({
        description: 'Bounty comment deleted.',
    })
    @ApiNotFoundResponse({
        description: 'Bounty with the given id within given network not found or a comment for a bounty not found',
    })
    @UseGuards(SessionGuard)
    async delete(
        @Param() { bountyIndex }: BountyParam,
        @Param() { commentId }: CommentParam,
        @Query() { network }: NetworkNameQuery,
        @ReqSession() session: SessionData,
    ): Promise<void> {
        logger.info(`Deleting comment ${commentId} for bounty with index ${bountyIndex} and network ${network}`)
        await this.service.delete(Number(bountyIndex), network, commentId, session.user)
    }
}
