import { Body, Delete, Get, HttpStatus, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
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
import { getLogger } from '../../logging.module'
import { ProposalCommentsService } from './proposal-comments.service'
import { CommentDto } from '../../comments/dto/comment.dto'
import { ProposalsQuery } from '../proposals.query'
import { BlockchainProposalIndex } from './blockchainProposalIndex.param'
import { CreateCommentDto } from '../../comments/dto/create-comment.dto'
import { NetworkDto } from './network.dto'
import { UpdateCommentDto } from '../../comments/dto/update-comment.dto'

const logger = getLogger()

@ControllerApiVersion('/proposals/:blockchainProposalIndex/comments', ['v1'])
@ApiTags('proposals.comments')
export class ProposalCommentsController {
    constructor(
        @Inject(ProposalCommentsService)
        private readonly proposalCommentsService: ProposalCommentsService,
    ) {}

    @Get()
    @ApiParam({
        name: 'blockchainProposalIndex',
        description: 'Blockchain Proposal index',
    })
    @ApiOkResponse({
        description: 'Respond with proposal discussion.',
        type: [Array],
    })
    @ApiNotFoundResponse({
        description: 'Proposal with the given proposal index not found.',
    })
    async getAll(
        @Param() { blockchainProposalIndex }: BlockchainProposalIndex,
        @Query() { network }: ProposalsQuery,
    ): Promise<CommentDto[]> {
        logger.info(
            `Getting comments for proposal with blockchainProposalIndex: ${blockchainProposalIndex} and network ${network}`,
        )
        const proposalComments = await this.proposalCommentsService.findAll(blockchainProposalIndex, network)
        return proposalComments.map(({ comment }) => new CommentDto(comment))
    }

    @Post()
    @ApiParam({
        name: 'blockchainProposalIndex',
        description: 'Proposal Index',
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
        @Param() { blockchainProposalIndex }: BlockchainProposalIndex,
        @Body() createCommentDto: CreateCommentDto & NetworkDto,
        @ReqSession() session: SessionData,
    ): Promise<CommentDto> {
        const { network } = createCommentDto
        logger.info(
            `Creating new proposal comment for proposal with blockchainProposalIndex ${blockchainProposalIndex} and network ${network}`,
        )
        const { comment } = await this.proposalCommentsService.create(
            blockchainProposalIndex,
            network,
            session.user,
            createCommentDto,
        )
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
        @Param() { blockchainProposalIndex }: BlockchainProposalIndex,
        @Param('commentId') commentId: string,
        @Body() updateCommentDto: UpdateCommentDto & NetworkDto,
        @ReqSession() session: SessionData,
    ): Promise<CommentDto> {
        logger.info(`Updating idea comment ${commentId}...`, updateCommentDto)
        const { network } = updateCommentDto
        const { comment } = await this.proposalCommentsService.update(
            blockchainProposalIndex,
            network,
            commentId,
            updateCommentDto,
            session.user,
        )
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
        @Param() { blockchainProposalIndex }: BlockchainProposalIndex,
        @Param('commentId') commentId: string,
        @ReqSession() session: SessionData,
    ) {
        logger.info(`Deleting idea comment ${commentId}...`)
        await this.proposalCommentsService.delete(blockchainProposalIndex, commentId, session.user)
    }
}
