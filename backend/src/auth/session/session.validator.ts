import {Injectable} from "@nestjs/common";
import {UsersService} from "../../users/users.service";
import {Response} from "express";
import {getSession} from "supertokens-node/lib/build/recipe/session";
import {SessionRequest} from "./session.middleware";
import SessionError from "supertokens-node/lib/build/recipe/session/error";

@Injectable()
export class SessionValidator {
    constructor(
        private readonly userService: UsersService,
    ) {
    }

    async validateSession(req: SessionRequest, res: Response): Promise<boolean> {
        try {
            await this.resolveUserAndUpdateSessionData(req, res)
            return true
        } catch (error) {
            return false
        }
    }

    async resolveUserAndUpdateSessionData(req: SessionRequest, res: Response) {
        const session = await getSession(req, res, false)
        const sessionData = await session.getSessionData()
        if (sessionData.user) {
            req.session = sessionData.user
        } else {
            const userId = await session.getUserId();
            const user = await this.userService.findOneByAuthId(userId);
            if (!user) {
                await session.revokeSession()
            } else {
                req.session = {user}
                await session.updateSessionData({
                    ...sessionData,
                    user
                })
            }
        }
    }

    handleResponseIfRefreshTokenError(res: Response, error: any) {
        if (error.type === SessionError.TRY_REFRESH_TOKEN) {
            const refreshHttpStatus = 440
            res.status(refreshHttpStatus).send("Please refresh token.")
        }
    }

}
