import {Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {ControllerApiVersion} from "../utils/ControllerApiVersion";
import {ReqSession, SessionData} from "./session/session.decorator";
import {SessionGuard} from "./session/guard/session.guard";

/**
 * There are no sign in and sign up requests, because they are automatically
 * created by SuperTokens core.
 */
@ControllerApiVersion('/auth', ['v1'])
@ApiTags('auth')
export class AuthController {
    @Get('/session')
    @UseGuards(SessionGuard)
    async getSessionData(@ReqSession() session?: SessionData): Promise<SessionData | undefined> {
        return session
    }
}
