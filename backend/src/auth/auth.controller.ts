import {Controller, Get, UseGuards} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {ReqSession, SessionUser} from "./session/session.decorator";
import {SessionGuard} from "./session/session.guard";

@Controller('/v1/auth')
@ApiTags('auth')
@UseGuards(SessionGuard)
export class AuthController {

    @Get('/session')
    async sampleAuthRequest(@ReqSession() session: SessionUser): Promise<SessionUser> {
        return session
    }

}
