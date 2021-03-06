import {Body, Controller, Get, Post, Req, Res, UseGuards} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {ReqSession, SessionUser} from "./session/session.decorator";
import {SessionGuard} from "./session/session.guard";
import {BlockchainUserSignUpDto} from "./blockchainUserSignUp.dto";
import {AuthService} from "./auth.service";
import {RegisterBlockchainTokenDto} from "./registerBlockchainToken.dto";
import {Request, Response} from "express";

@Controller('/v1/auth')
@ApiTags('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Get('/session')
    @UseGuards(SessionGuard)
    async sampleAuthRequest(@ReqSession() session: SessionUser): Promise<SessionUser> {
        return session
    }

    @Post('/blockchain/signup')
    async blockchainSignUp(@Body() user: BlockchainUserSignUpDto) {
        await this.authService.blockchainSignUp(user)
    }

    @Post('/blockchain/register-token')
    @UseGuards(SessionGuard)
    async registerBlockchainToken(
        @Req() req: Request,
        @Res() res: Response,
        @Body() blockchainToken: RegisterBlockchainTokenDto
    ) {
        await this.authService.registerBlockchainToken(req, res, blockchainToken.token)
    }

}
