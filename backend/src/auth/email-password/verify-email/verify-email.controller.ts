import { HttpStatus, Param, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { ControllerApiVersion } from '../../../utils/ControllerApiVersion'
import { SuperTokensService } from '../../supertokens/supertokens.service'

/*
We need to implement our onw verify email endpoint as the SuperTokens endpoint only allows a logged in user to verify their email
 */
@ControllerApiVersion('/auth/email-password/verify', ['v1'])
export class VerifyEmailController {
    constructor(private readonly superTokensService: SuperTokensService) {}

    @Post('/:token')
    async verifyEmail(@Param('token') token: string, @Res() res: Response, @Req() req: Request): Promise<void> {
        await this.superTokensService.verifyEmailByToken(req, res, token)
        res.status(HttpStatus.OK).send()
    }
}
