import { Body, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../../auth/guards/session.guard'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'
import { getLogger } from '../../logging.module'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { CommentReactionsService } from './comment-reactions.service'
import { CreateReactionDto } from './dto/create-reaction.dto'
import { ReactionDto } from './dto/reaction.dto'

const logger = getLogger()

@ControllerApiVersion('/comments/:commentId/reactions', ['v1'])
@ApiTags('reactions')
export class CommentReactionsController {
    constructor(private readonly reactionsService: CommentReactionsService) {}

    @Post()
    @ApiCreatedResponse({
        description: 'New reaction added.',
        type: ReactionDto,
    })
    @ApiForbiddenResponse({ description: 'You cannot add multiple reactions of the same type' })
    @UseGuards(SessionGuard)
    async create(
        @Body() dto: CreateReactionDto,
        @ReqSession() session: SessionData,
        @Param() { commentId }: { commentId: string },
    ): Promise<ReactionDto> {
        logger.info(`Creating a reaction for comment with user`, dto, session.user)
        const reaction = await this.reactionsService.create(dto, commentId, session.user)
        return new ReactionDto(reaction)
    }

    @Delete('/:id')
    @ApiOkResponse({ description: 'Reaction deleted.' })
    @ApiNotFoundResponse({ description: 'Reaction with the given id does not exist' })
    @UseGuards(SessionGuard)
    async delete(
        @Param() { id, commentId }: { id: string; commentId: string },
        @ReqSession() session: SessionData,
    ): Promise<void> {
        logger.info(`Deleting a reaction ${id} of a comment ${commentId} with user`, session.user)
        return this.reactionsService.delete(id, session.user)
    }
}
