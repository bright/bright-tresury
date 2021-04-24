import {Controller, Get, UseGuards} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {ReqSession, SessionData} from "./session/session.decorator";
import {SessionGuard} from "./session/guard/session.guard";

/**
 * There are no sign in and sign up requests, because they are automatically
 * created by SuperTokens core.
 */
@Controller('/v1/auth')
@ApiTags('auth')
export class AuthController {
    @Get('/session')
    @UseGuards(SessionGuard)
    async getSessionData(@ReqSession() session?: SessionData): Promise<SessionData | undefined> {
        return session
    }
}
