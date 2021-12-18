import { Body, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger'
import { SessionGuard } from '../auth/guards/session.guard'
import { ReqSession, SessionData } from '../auth/session/session.decorator'
import { ProposedMotionDto } from '../blockchain/dto/proposed-motion.dto'
import { ExtrinsicEntity } from '../extrinsics/extrinsic.entity'
import { ExecutedMotionDto } from '../polkassembly/dto/executed-motion.dto'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { NetworkNameQuery } from '../utils/network-name.query'
import { BountiesService } from './bounties.service'
import { BountyParam } from './bounty.param'
import { BountyDto } from './dto/bounty.dto'
import { ListenForBountyDto } from './dto/listen-for-bounty.dto'
import { UpdateBountyDto } from './dto/update-bounty.dto'
import { PaginatedParams, PaginatedQueryParams } from '../utils/pagination/paginated.param'
import { getLogger } from '../logging.module'
import { PaginatedResponseDto } from '../utils/pagination/paginated.response.dto'
import { TimeFrame, TimeFrameQuery } from '../utils/time-frame.query'

const logger = getLogger()

@ControllerApiVersion('/bounties', ['v1'])
@ApiTags('bounties')
export class BountiesController {
    constructor(private bountiesService: BountiesService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with current bounties for the given network',
        type: PaginatedResponseDto,
    })

    async getBounties(
        @Query() { network }: NetworkNameQuery,
        @Query() { timeFrame = TimeFrame.OnChain}: TimeFrameQuery,
        @Query() { pageNumber, pageSize }: PaginatedQueryParams
    ): Promise<PaginatedResponseDto<BountyDto>> {
        logger.info(`Getting bounties for network: ${network} ${timeFrame} pageNumber: ${pageNumber} pageSize: ${pageSize}`)
        const paginatedParams = new PaginatedParams({pageNumber, pageSize})
        const { items, total } = await this.bountiesService.find(network, timeFrame, paginatedParams)
        return {
            items: items.map(({blockchain, entity, polkassembly}) => new BountyDto(blockchain, entity, polkassembly)),
            total
        }
    }

    @Get(':bountyIndex')
    @ApiOkResponse({
        description: 'Respond with bounty for the given index in the given network',
        type: BountyDto,
    })
    async getBounty(@Param() { bountyIndex }: BountyParam, @Query() { network }: NetworkNameQuery): Promise<BountyDto> {
        const [bountyBlockchain, bountyEntity, bountyPolkassemblyPost] = await this.bountiesService.getBounty(
            network,
            Number(bountyIndex),
        )
        return new BountyDto(bountyBlockchain, bountyEntity, bountyPolkassemblyPost)
    }

    @Get(':bountyIndex/motions')
    @ApiOkResponse({
        description: 'Respond with bounty motions for the given index in the given network',
        type: [ProposedMotionDto],
    })
    async getBountyMotions(
        @Param() { bountyIndex }: BountyParam,
        @Query() { network }: NetworkNameQuery,
    ): Promise<(ProposedMotionDto | ExecutedMotionDto)[]> {
        return this.bountiesService.getBountyMotions(network, Number(bountyIndex))
    }

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiCreatedResponse({
        description: 'Accepted to find a bounty proposal extrinsic and create a bounty entity',
    })
    @ApiBadRequestResponse({
        description: 'Not valid data',
    })
    @UseGuards(SessionGuard)
    async createBounty(
        @Body() dto: ListenForBountyDto,
        @ReqSession() sessionData: SessionData,
    ): Promise<ExtrinsicEntity> {
        return this.bountiesService.listenForProposeBountyExtrinsic(dto, sessionData.user)
    }

    @Patch(':bountyIndex')
    @ApiOkResponse({
        description: 'Bounty details successfully edited',
    })
    @ApiForbiddenResponse({
        description: 'You are not allowed to edit this bounty',
    })
    @ApiBadRequestResponse({
        description: 'Not valid data or this bounty cannot be edited',
    })
    @ApiNotFoundResponse({
        description: 'The bounty with the given id in the given network does not exist',
    })
    @UseGuards(SessionGuard)
    async editBounty(
        @Param() { bountyIndex }: BountyParam,
        @Body() dto: UpdateBountyDto,
        @Query() { network }: NetworkNameQuery,
        @ReqSession() sessionData: SessionData,
    ): Promise<BountyDto> {
        const [bountyBlockchain, bountyEntity, bountyPolkassemblyPost] = await this.bountiesService.update(
            Number(bountyIndex),
            network,
            dto,
            sessionData.user,
        )
        return new BountyDto(bountyBlockchain, bountyEntity, bountyPolkassemblyPost)
    }
}
