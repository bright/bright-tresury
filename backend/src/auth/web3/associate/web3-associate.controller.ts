import { Body, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger'
import { ControllerApiVersion } from '../../../utils/ControllerApiVersion'
import { SessionGuard } from '../../guards/session.guard'
import { ReqSession, SessionData } from '../../session/session.decorator'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { ConfirmSignMessageRequestDto } from '../signMessage/confirm-sign-message-request.dto'
import { StartSignMessageResponseDto } from '../signMessage/start-sign-message-response.dto'
import { StartWeb3AssociateRequestDto } from './dto/start-web3-associate-request.dto'
import { Web3AssociateService } from './web3-associate.service'

@ControllerApiVersion('/auth/web3/associate', ['v1'])
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
    @HttpCode(HttpStatus.OK)
    @UseGuards(SessionGuard)
    async startAssociatingAddress(
        @Body() startRequest: StartWeb3AssociateRequestDto,
        @ReqSession() session: SessionData,
    ): Promise<StartSignMessageResponseDto> {
        return this.web3AssociateService.start(startRequest, session)
    }

    @Post('/confirm')
    @HttpCode(HttpStatus.OK)
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
        @ReqSession() session: SessionData,
    ) {
        await this.web3AssociateService.confirm(confirmRequest, session)
        await this.superTokensService.refreshAccessTokenPayloadForUser(session.user.authId)
    }
}
