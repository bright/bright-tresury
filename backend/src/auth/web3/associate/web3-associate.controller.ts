import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Request, Response } from 'express'
import { Web3AssociateService } from './web3-associate.service'
import { SessionGuard } from '../../session/guard/session.guard'
import { ReqSession, SessionData } from '../../session/session.decorator'
import { ConfirmSignMessageRequestDto } from '../signMessage/confirm-sign-message-request.dto'
import { StartSignMessageRequestDto } from '../signMessage/start-sign-message-request.dto'
import { StartSignMessageResponseDto } from '../signMessage/start-sign-message-response.dto'
import { SuperTokensService } from '../../supertokens/supertokens.service'

@Controller('/v1/auth/web3/associate')
@ApiTags('auth.web3.associate')
export class Web3AssociateController {
    constructor(
        private readonly web3AssociateService: Web3AssociateService,
        private readonly superTokensService: SuperTokensService,
    ) {}

    @Post('/start')
    @ApiOkResponse({
        description: 'Association successfully started',
        type: [StartSignMessageResponseDto],
    })
    @ApiBadRequestResponse({
        description: 'Requested address is invalid',
    })
    @ApiConflictResponse({
        description: 'Requested address already exists',
    })
    async startAssociatingAddress(
        @Body() startRequest: StartSignMessageRequestDto,
    ): Promise<StartSignMessageResponseDto> {
        return this.web3AssociateService.startSignMessage(startRequest)
    }

    @Post('/confirm')
    @UseGuards(SessionGuard)
    @ApiOkResponse({
        description: 'Association successfully confirmed',
    })
    @ApiBadRequestResponse({
        description: 'Requested address or signature is not valid',
    })
    @ApiConflictResponse({
        description: 'Requested address already exists',
    })
    @ApiForbiddenResponse({
        description: "Can't associate account when not signed in",
    })
    async confirmAssociatingAddress(
        @Body() confirmRequest: ConfirmSignMessageRequestDto,
        @Res() res: Response,
        @Req() req: Request,
        @ReqSession() session: SessionData,
    ) {
        await this.web3AssociateService.confirmAssociateAddress(confirmRequest, res, session)
        await this.superTokensService.refreshJwtPayload(req, res)
        res.status(HttpStatus.OK).send()
    }
}
