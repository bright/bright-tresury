import { Body, Get, Param, Patch, Query, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../auth/guards/session.guard'
import { UserGuard } from '../auth/guards/user.guard'
import { ReqSession, SessionData } from '../auth/session/session.decorator'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { PaginatedParams, PaginatedQueryParams } from '../utils/pagination/paginated.param'
import { PaginatedResponseDto } from '../utils/pagination/paginated.response.dto'
import { AppEventQuery } from './app-event.query'
import { AppEventsService } from './app-events.service'
import { AppEventDto } from './dto/app-event.dto'
import { ReadAppEventDto } from './dto/read-app-event.dto'

@ControllerApiVersion('/users/:userId/app-events', ['v1'])
@ApiTags('users.app-events')
export class AppEventsController {
    constructor(private readonly appEventsService: AppEventsService) {}

    @Get()
    @ApiOkResponse({
        description: "Respond with all user's app events.",
        type: PaginatedResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'You can only get yours app events.',
    })
    @ApiBadRequestResponse({
        description: 'Not valid app event type or is read params.',
    })
    @UseGuards(SessionGuard)
    @UseGuards(UserGuard)
    async getAll(
        @ReqSession() session: SessionData,
        @Param('userId') userId: string,
        @Query() paginated: PaginatedQueryParams,
        @Query() { isRead, appEventType, ideaId, networkId, proposalIndex, bountyIndex, tipHash }: AppEventQuery,
    ): Promise<PaginatedResponseDto<AppEventDto>> {
        const { items, total } = await this.appEventsService.findAll(
            {
                userId,
                isRead: typeof isRead === 'string' ? isRead === 'true' : undefined,
                appEventType,
                ideaId,
                networkId,
                proposalIndex: typeof proposalIndex === 'string' ? Number(proposalIndex) : undefined,
                bountyIndex: typeof bountyIndex === 'string' ? Number(bountyIndex) : undefined,
                tipHash,
            },
            new PaginatedParams(paginated),
        )
        return {
            items: items.map((item) => new AppEventDto(item, item.receivers?.[0])),
            total,
        }
    }

    @Patch('/read')
    @ApiOkResponse({
        description: 'All provided app events marked as read.',
    })
    @ApiForbiddenResponse({
        description: 'You can only read yours app events.',
    })
    @ApiBadRequestResponse({
        description: 'You need to provide app event ids.',
    })
    @UseGuards(SessionGuard)
    @UseGuards(UserGuard)
    async markAsRead(
        @ReqSession() session: SessionData,
        @Param('userId') userId: string,
        @Body() { appEventIds }: ReadAppEventDto,
    ): Promise<void> {
        await this.appEventsService.markAsRead(userId, appEventIds)
    }
}
