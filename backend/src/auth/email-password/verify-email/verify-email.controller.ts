import { ControllerApiVersion } from '../../../utils/ControllerApiVersion'
import { HttpStatus, Param, Post, Req, Res } from '@nestjs/common'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { Request, Response } from 'express'

@ControllerApiVersion('/auth/email-password/verify', ['v1'])
export class VerifyEmailController {
    constructor(private readonly superTokensService: SuperTokensService) {}

    @Post('/:token')
    async verifyEmail(@Param('token') token: string, @Res() res: Response, @Req() req: Request): Promise<void> {
        await this.superTokensService.verifyEmailByToken(req, res, token)
        res.status(HttpStatus.OK).send()
    }
}
