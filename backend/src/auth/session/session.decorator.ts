import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {User} from "../../users/user.entity";

export interface SessionUser {
    user: User,
    blockchainToken?: string
}

export const ReqSession = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext): Promise<SessionUser | undefined> => {
        const req = ctx.switchToHttp().getRequest();
        return req.session;
    },
);
