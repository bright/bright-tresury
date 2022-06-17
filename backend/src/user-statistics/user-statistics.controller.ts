import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Get, Param, Query, UseGuards } from '@nestjs/common'
import { SessionGuard } from '../auth/guards/session.guard'
import { UserGuard } from '../auth/guards/user.guard'
import { ReqSession, SessionData } from '../auth/session/session.decorator'
import { NetworkNameQuery } from '../utils/network-name.query'
import { UserStatisticsService } from './user-statistics.service'
import { UserStatisticsDto } from './user-statistics.dto'

@ControllerApiVersion('/users/:userId/statistics', ['v1'])
@ApiTags('users.statistics')
export class UserStatisticsController {
    constructor(private userStatisticsService: UserStatisticsService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with user ideas/proposals/bounties/tips count',
        type: UserStatisticsDto,
    })
    @ApiForbiddenResponse({
        description: 'You can only get yours statistics.',
    })
    @ApiBadRequestResponse({
        description: 'Not valid network name or userId uuid',
    })
    @UseGuards(SessionGuard)
    @UseGuards(UserGuard)
    async get(
        @ReqSession() session: SessionData,
        @Param('userId') userId: string,
        @Query() { network }: NetworkNameQuery,
    ): Promise<UserStatisticsDto> {
        return this.userStatisticsService.getUserStatistics(network, userId)
    }
}
