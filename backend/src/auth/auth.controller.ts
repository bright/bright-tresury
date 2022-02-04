import { Delete, Get, UseGuards } from '@nestjs/common'
import { ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { getLogger } from '../logging.module'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { SessionGuard } from './guards/session.guard'
import { ReqSession, SessionData } from './session/session.decorator'
import { SuperTokensService } from './supertokens/supertokens.service'

const logger = getLogger()

/**
 * There are no sign in and sign up requests, because they are automatically
 * created by SuperTokens core.
 */
@ControllerApiVersion('/auth', ['v1'])
@ApiTags('auth')
export class AuthController {
    constructor(private readonly superTokensService: SuperTokensService) {}
    @Get('/session')
    @UseGuards(SessionGuard)
    async getSessionData(@ReqSession() session?: SessionData): Promise<SessionData | undefined> {
        return session
    }

    @ApiOkResponse({
        description: 'Deleted user.',
    })
    @ApiForbiddenResponse({
        description: 'User cannot be deleted',
    })
    @Delete('/unregister')
    @UseGuards(SessionGuard)
    async unregister(@ReqSession() sessionData: SessionData) {
        logger.info(`Deleting user ${sessionData.user.id}...`)
        await this.superTokensService.deleteUser(sessionData.user)
    }
}
