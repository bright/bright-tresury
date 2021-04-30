import {Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {ReqSession, SessionData} from "./session/session.decorator";
import {SessionGuard} from "./session/guard/session.guard";
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
    async getSessionData(@ReqSession() session?: SessionData): Promise<SessionData | undefined> {
        return session
    }

    @Post('/blockchain/signup')
    async blockchainSignUp(@Body() user: BlockchainUserSignUpDto, @Res() res: Response) {
        await this.authService.blockchainSignUp(res, user)
        res.status(HttpStatus.OK).send()
    }

    @Post('/blockchain/register-token')
    @UseGuards(SessionGuard)
    async registerBlockchainToken(
        @Req() req: Request,
        @Res() res: Response,
        @Body() blockchainToken: RegisterBlockchainTokenDto,
        @ReqSession() session: SessionData
    ) {
        await this.authService.registerBlockchainToken(req, res, blockchainToken.token)
        res.status(HttpStatus.OK).send()
    }
}
