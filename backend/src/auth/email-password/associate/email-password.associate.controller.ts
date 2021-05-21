import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {SessionGuard} from "../../session/guard/session.guard";
import {ReqSession, SessionData} from "../../session/session.decorator";
import {StartSignMessageResponseDto} from "../../web3/signMessage/start-sign-message-response.dto";
import {ConfirmWeb3SignUpRequestDto} from "../../web3/signUp/dto/confirm-web3-sign-up-request.dto";

@Controller('/v1/auth/email-password/associate')
@ApiTags('auth.web3')
export class EmailPasswordAssociateController {
    @Post('/start')
    @ApiOkResponse({
        description: 'Association successfully started',
        type: [StartSignMessageResponseDto],
    })
    @UseGuards(SessionGuard)
    async startAssociate(@ReqSession() session: SessionData,): Promise<void> {}

    @Post('/confirm')
    @UseGuards(SessionGuard)
    @ApiOkResponse({
        description: 'Association successfully confirmed',
        type: [StartSignMessageResponseDto],
    })
    async confirmAssociatingAddress(
        @Body() confirmRequest: ConfirmWeb3SignUpRequestDto,
        @ReqSession() session: SessionData,
    ) {
    }
}
