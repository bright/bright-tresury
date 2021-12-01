import { Body, Param, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../../auth/guards/session.guard'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'
import { CommentDto } from '../../comments/dto/comment.dto'
import { getLogger } from '../../logging.module'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { BountyParam } from '../bounty.param'
import { BountyCommentsService } from './bounty-comments.service'
import { CreateBountyCommentDto } from './dto/create-bounty-comment.dto'

const logger = getLogger()

@ControllerApiVersion('/bounties/:bountyIndex/comments', ['v1'])
@ApiTags('bounties.comments')
export class BountyCommentsController {
    constructor(private readonly service: BountyCommentsService) {}

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
        @Body() dto: CreateBountyCommentDto,
        @ReqSession() session: SessionData,
    ): Promise<CommentDto> {
        logger.info(`Creating new comment for bounty with index ${bountyIndex} and network ${dto.networkId}`)
        const { comment } = await this.service.create(Number(bountyIndex), dto, session.user)
        return new CommentDto(comment)
    }
}
