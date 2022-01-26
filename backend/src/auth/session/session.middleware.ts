import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { getLogger } from '../../logging.module'
import { SessionData } from './session.decorator'
import { ISessionResolver, SessionResolverProvider } from './session.resolver'

export interface SessionRequest extends Request {
    session?: SessionData
}

/**
 * Used to extend request with current session data which can be obtained
 * using ReqSession decorator in `session.decorator.ts` file.
 *
 * It also handles refresh token exceptions.
 */
@Injectable()
export class SessionUserMiddleware implements NestMiddleware {
    constructor(@Inject(SessionResolverProvider) private readonly sessionResolver: ISessionResolver) {}

    async use(req: SessionRequest, res: Response, next: NextFunction) {
        try {
            await this.sessionResolver.resolveUserAndUpdateSessionData(req, res)
            next()
        } catch (error) {
            this.sessionResolver.handleResponseIfRefreshTokenError(res, error)
        }
    }
}
