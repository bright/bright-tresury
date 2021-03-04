import {createParamDecorator} from '@nestjs/common';
import {User} from "../../users/user.entity";
import {SessionRequest} from "./session.middleware";

export interface SessionUser {
    user: User
}

export const ReqSession = createParamDecorator(
    async (data: unknown, req: SessionRequest): Promise<SessionUser | undefined> => {
        return req.session;
    },
);
