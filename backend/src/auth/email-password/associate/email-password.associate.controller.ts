import {Body, Controller, HttpCode, Post, UseGuards} from '@nestjs/common';
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {SessionGuard} from "../../session/guard/session.guard";
import {ReqSession, SessionData} from "../../session/session.decorator";
import {StartSignMessageResponseDto} from "../../web3/signMessage/start-sign-message-response.dto";
import {ConfirmEmailPasswordAssociateRequestDto} from "./dto/confirm.request.dto";
import {StartEmailPasswordAssociateRequestDto} from "./dto/start.request.dto";
import {EmailPasswordAssociateService} from "./email-password.associate.service";

@Controller('/v1/auth/email-password/associate')
@ApiTags('auth.web3')
export class EmailPasswordAssociateController {
    constructor(private readonly emailPasswordAssociateService: EmailPasswordAssociateService) {}

    @Post('/start')
    @ApiOkResponse({
        description: 'Association successfully started',
        type: [StartSignMessageResponseDto],
    })
    @UseGuards(SessionGuard)
    @HttpCode(200)
    async startAssociate(@ReqSession() session: SessionData, @Body() dto: StartEmailPasswordAssociateRequestDto): Promise<StartSignMessageResponseDto> {
        return this.emailPasswordAssociateService.start(dto)
    }

    @Post('/confirm')
    @UseGuards(SessionGuard)
    @ApiOkResponse({
        description: 'Association successfully confirmed',
        type: [StartSignMessageResponseDto],
    })
    @HttpCode(200)
    async confirmAssociatingAddress(
        @Body() dto: ConfirmEmailPasswordAssociateRequestDto,
        @ReqSession() session: SessionData,
    ): Promise<void> {
        return this.emailPasswordAssociateService.confirm(dto, session)
    }
}
