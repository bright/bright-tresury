import { Body, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../auth/guards/session.guard'
import { ReqSession, SessionData } from '../auth/session/session.decorator'
import { ExtrinsicEntity } from '../extrinsics/extrinsic.entity'
import { getLogger } from '../logging.module'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { NetworkNameQuery } from '../utils/network-name.query'
import { PaginatedParams, PaginatedQueryParams } from '../utils/pagination/paginated.param'
import { PaginatedResponseDto } from '../utils/pagination/paginated.response.dto'
import { ListenForTipDto } from './dto/listen-for-tip.dto'
import { TipDto } from './dto/tip.dto'
import { TipFilterQuery } from './tip-filter.query'
import { TipsService } from './tips.service'

const logger = getLogger()

@ControllerApiVersion('/tips', ['v1'])
@ApiTags('tips')
export class TipsController {
    constructor(private tipsService: TipsService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with tips for the given network',
        type: PaginatedResponseDto,
    })
    async getTips(
        @Query() { network }: NetworkNameQuery,
        @Query() filterQuery: TipFilterQuery,
        @Query() paginatedQueryParams: PaginatedQueryParams,
    ): Promise<PaginatedResponseDto<TipDto>> {
        logger.info('Getting tips for network', network)
        const { items, total } = await this.tipsService.find(
            network,
            filterQuery,
            new PaginatedParams(paginatedQueryParams),
        )
        return { items: items.map((item) => new TipDto(item)), total }
    }

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiCreatedResponse({
        description: 'Accepted to find a tip proposal extrinsic and create a tip entity',
    })
    @ApiBadRequestResponse({
        description: 'Not valid data',
    })
    @UseGuards(SessionGuard)
    async createTip(@Body() dto: ListenForTipDto, @ReqSession() sessionData: SessionData): Promise<ExtrinsicEntity> {
        return this.tipsService.listenForNewTipExtrinsic(dto, sessionData.user)
    }
}
