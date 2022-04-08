import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { TipsService } from './tips.service'
import { Get, Query } from '@nestjs/common'
import { NetworkNameQuery } from '../utils/network-name.query'
import { PaginatedParams, PaginatedQueryParams } from '../utils/pagination/paginated.param'
import { PaginationResponseDto } from '../../../www/src/util/pagination/pagination.response.dto'
import { TipDto } from './dtos/tip.dto'
import { getLogger } from '../logging.module'
import { PaginatedResponseDto } from '../utils/pagination/paginated.response.dto'
import { TipFilterQuery } from './tip-filter.query'

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
    ): Promise<PaginationResponseDto<TipDto>> {
        logger.info('Getting tips for network', network)
        const { items, total } = await this.tipsService.find(
            network,
            filterQuery,
            new PaginatedParams(paginatedQueryParams),
        )
        return { items: items.map((item) => new TipDto(item)), total }
    }
}
