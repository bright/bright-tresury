import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {User} from "../../users/user.entity";

export interface SessionData {
    user: User,
    blockchainToken?: string
}

export const ReqSession = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext): Promise<SessionData | undefined> => {
        const req = ctx.switchToHttp().getRequest();
        return req.session;
    },
);
