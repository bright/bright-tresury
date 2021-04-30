import {Injectable} from "@nestjs/common";
import {Response} from "express";
import {SessionData} from "./session.decorator";
import {ISessionResolver} from "./session.resolver";
import {SessionRequest} from "./session.middleware";

@Injectable()
export class MockSessionResolver implements ISessionResolver {

    sessionUser?: SessionData

    async validateSession(req: SessionRequest, res: Response): Promise<boolean> {
        return !!this.sessionUser
    }

    async resolveUserAndUpdateSessionData(req: SessionRequest, res: Response): Promise<void> {
        req.session = this.sessionUser
    }

    handleResponseIfRefreshTokenError(res: Response, error: any): any {
        return
    }
}
