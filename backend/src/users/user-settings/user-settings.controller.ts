import { Body, Get, Param, Patch, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger'
import { SessionGuard } from '../../auth/guards/session.guard'
import { UserGuard } from '../../auth/guards/user.guard'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { UsersService } from '../users.service'
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto'
import { UserSettingsDto } from './dto/user-settings.dto'
import { UserSettingsService } from './user-settings.service'

@ApiTags('users.settings')
@ControllerApiVersion('/users/:userId/settings', ['v1'])
export class UserSettingsController {
    constructor(
        private readonly userSettingsService: UserSettingsService,
        private readonly usersService: UsersService,
    ) {}

    @Get('')
    @ApiOkResponse({
        description: "Respond with user's settings.",
        type: UserSettingsDto,
    })
    @ApiNotFoundResponse({
        description: 'User not found.',
    })
    @ApiForbiddenResponse({
        description: "You cannot access this user's data.",
    })
    @ApiBadRequestResponse({
        description: 'Not valid parameters.',
    })
    @UseGuards(SessionGuard)
    @UseGuards(UserGuard)
    async getOne(@Param('userId') userId: string): Promise<UserSettingsDto> {
        const user = await this.usersService.findOneOrThrow(userId)
        return new UserSettingsDto(user)
    }

    @Patch('')
    @ApiOkResponse({
        description: "User's settings updated.",
        type: UserSettingsDto,
    })
    @ApiNotFoundResponse({
        description: 'User not found.',
    })
    @ApiForbiddenResponse({
        description: "You cannot access this user's data.",
    })
    @ApiBadRequestResponse({
        description: 'Not valid parameters.',
    })
    @UseGuards(SessionGuard)
    @UseGuards(UserGuard)
    async update(@Param('userId') userId: string, @Body() dto: UpdateUserSettingsDto): Promise<UserSettingsDto> {
        const user = await this.userSettingsService.update(userId, dto)
        return new UserSettingsDto(user)
    }
}
