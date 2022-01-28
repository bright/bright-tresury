import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Delete, Param, UseGuards } from '@nestjs/common'
import { getLogger } from '../logging.module'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { UsersService } from './users.service'
import { UserGuard } from '../auth/guards/user.guard'
import { SessionGuard } from '../auth/guards/session.guard'

const logger = getLogger()

@ControllerApiVersion('/users/:userId', ['v1'])
@ApiTags('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOkResponse({
        description: 'Deleted user.',
    })
    @ApiNotFoundResponse({
        description: 'No user found.',
    })
    @ApiForbiddenResponse({
        description: 'User with the given id cannot be deleted',
    })
    @Delete()
    @UseGuards(SessionGuard)
    @UseGuards(UserGuard)
    async delete(@Param('userId') id: string) {
        logger.info(`Deleting user ${id}...`)
        await this.usersService.delete(id)
    }
}
