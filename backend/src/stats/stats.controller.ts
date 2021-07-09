import { Get, Query } from '@nestjs/common'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { StatsService } from './stats.service'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { StatsDto } from './stats.dto'
import { NetworkNameQuery } from '../utils/network-name.query'

@ControllerApiVersion('/stats', ['v1'])
@ApiTags('stats')
export class StatsController {
    constructor(private statsService: StatsService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with all stats.',
        type: StatsDto,
    })
    async getStats(@Query() { network }: NetworkNameQuery): Promise<StatsDto> {
        return this.statsService.getStats(network)
    }
}
