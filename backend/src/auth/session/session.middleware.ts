import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import {SessionUser} from "./session.decorator";
import {SessionValidator} from "./session.validator";

export interface SessionRequest extends Request {
    session: SessionUser;
}

/**
 * Used to extend request with current session data which can be obtained
 * using ReqSession decorator in `session.decorator.ts` file.
 *
 * It also handles refresh token exceptions.
 */
@Injectable()
export class SessionUserMiddleware implements NestMiddleware {
    constructor(
        private readonly sessionValidator: SessionValidator,
    ) {
    }

    async use(req: SessionRequest, res: Response, next: NextFunction) {
        try {
            await this.sessionValidator.resolveUserAndUpdateSessionData(req, res)
            next()
        } catch (error) {
            this.sessionValidator.handleResponseIfRefreshTokenError(res, error)
            next()
        }
    }
}
