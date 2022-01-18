import { HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { getLogger } from '../../../logging.module'
import { ControllerApiVersion } from '../../../utils/ControllerApiVersion'
import { SuperTokensService } from '../../supertokens/supertokens.service'

const logger = getLogger()

/*
We need to implement our onw verify email endpoint as the SuperTokens endpoint only allows a logged in user to verify their email
 */
@ControllerApiVersion('/auth/email-password/verify', ['v1'])
export class VerifyEmailController {
    constructor(private readonly superTokensService: SuperTokensService) {}

    @Post(':token')
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Param('token') token: string): Promise<void> {
        logger.info('Verifying email address with token', token)
        await this.superTokensService.verifyEmailByToken(token)
    }
}
