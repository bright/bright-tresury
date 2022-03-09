import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Response } from 'express'
import { SessionRequest } from './session.middleware'
import { SuperTokensService } from '../supertokens/supertokens.service'
import { SessionData } from './session.decorator'

export const SessionResolverProvider = 'SessionResolverProvider'

export interface ISessionResolver {
    validateSession(req: SessionRequest, res: Response): Promise<boolean>

    resolveUserAndUpdateSessionData(req: SessionRequest, res: Response): Promise<void>

    handleResponseIfRefreshTokenError(res: Response, error: any): any
}

@Injectable()
export class SessionResolver implements ISessionResolver {
    constructor(private readonly superTokensService: SuperTokensService) {}

    async validateSession(req: SessionRequest, res: Response): Promise<boolean> {
        try {
            await this.resolveUserAndUpdateSessionData(req, res)
            return true
        } catch (error) {
            return false
        }
    }

    async resolveUserAndUpdateSessionData(req: SessionRequest, res: Response) {
        const session = await this.superTokensService.getSession(req, res)
        if (!session) {
            return
        }

        const sessionData = await session.getSessionData()

        let sessionUser: SessionData | undefined
        if (sessionData.user) {
            sessionUser = sessionData as SessionData
        } else {
            await this.superTokensService.refreshSessionData(session)
            sessionUser = await session.getSessionData()
        }
        if (sessionUser) {
            const isEmailVerified = await this.superTokensService.isEmailVerified(sessionUser.user)
            if (isEmailVerified) {
                req.session = sessionUser
            } else {
                throw new UnauthorizedException()
            }
        }
    }

    handleResponseIfRefreshTokenError(res: Response, error: any) {
        this.superTokensService.handleResponseIfRefreshTokenError(res, error)
    }
}
