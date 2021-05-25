import {Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common';
import {ApiBadRequestResponse, ApiConflictResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {Request, Response} from "express";
import {SessionGuard} from "../../session/guard/session.guard";
import {ReqSession, SessionData} from "../../session/session.decorator";
import {SuperTokensService} from "../../supertokens/supertokens.service";
import {StartSignMessageResponseDto} from "../../web3/signMessage/start-sign-message-response.dto";
import {ConfirmEmailPasswordAssociateRequestDto} from "./dto/confirm.request.dto";
import {StartEmailPasswordAssociateRequestDto} from "./dto/start.request.dto";
import {EmailPasswordAssociateService} from "./email-password.associate.service";

@Controller('/v1/auth/email-password/associate')
@ApiTags('auth.web3')
export class EmailPasswordAssociateController {
    constructor(private readonly emailPasswordAssociateService: EmailPasswordAssociateService,
                private readonly superTokensService: SuperTokensService,) {
    }

    @Post('/start')
    @ApiOkResponse({
        description: 'Association successfully started',
        type: [StartSignMessageResponseDto],
    })
    @ApiBadRequestResponse({
        description: 'Requested address, email, username or password is not valid',
    })
    @ApiConflictResponse({
        description: 'Email or username already exists',
    })
    @ApiForbiddenResponse({
        description: "Can't associate account when not signed in",
    })
    @UseGuards(SessionGuard)
    @HttpCode(HttpStatus.OK)
    async startAssociate(@ReqSession() session: SessionData, @Body() dto: StartEmailPasswordAssociateRequestDto): Promise<StartSignMessageResponseDto> {
        return this.emailPasswordAssociateService.start(dto)
    }

    @Post('/confirm')
    @UseGuards(SessionGuard)
    @ApiOkResponse({
        description: 'Association successfully confirmed',
        type: [StartSignMessageResponseDto],
    })
    @ApiBadRequestResponse({
        description: 'Requested address, signature, email, username or password is not valid',
    })
    @ApiConflictResponse({
        description: 'Email or username already exists',
    })
    @ApiForbiddenResponse({
        description: "Can't associate account when not signed in",
    })
    @HttpCode(HttpStatus.OK)
    async confirmAssociatingAddress(
        @Body() dto: ConfirmEmailPasswordAssociateRequestDto,
        @Res() res: Response,
        @Req() req: Request,
        @ReqSession() session: SessionData,
    ): Promise<void> {
        await this.emailPasswordAssociateService.confirm(dto, session)
        await this.superTokensService.refreshJwtPayload(req, res)
        res.send()
    }
}
