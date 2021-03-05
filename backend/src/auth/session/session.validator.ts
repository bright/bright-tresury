import {Injectable} from "@nestjs/common";
import {UsersService} from "../../users/users.service";
import {Response} from "express";
import {SessionRequest} from "./session.middleware";
import {SuperTokensService} from "../supertokens/supertokens.service";
import {SessionUser} from "./session.decorator";

@Injectable()
export class SessionValidator {
    constructor(
        private readonly userService: UsersService,
        private readonly superTokensService: SuperTokensService,
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
        const session = await this.superTokensService.getSession(req, res, false)
        const sessionData = await session.getSessionData()
        if (sessionData.user) {
            req.session = sessionData as SessionUser
        } else {
            const userId = await session.getUserId();
            const user = await this.userService.findOneByAuthId(userId);
            if (!user) {
                await session.revokeSession()
            } else {
                req.session = sessionData
                await this.superTokensService.addSessionData(req, res, {user})
            }
        }
    }

    handleResponseIfRefreshTokenError(res: Response, error: any) {
        this.superTokensService.handleResponseIfRefreshTokenError(res, error)
    }

}
