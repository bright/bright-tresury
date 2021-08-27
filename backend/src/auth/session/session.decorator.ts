import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '../../users/user.entity'

export interface SessionData {
    user: User
}

export const ReqSession = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext): Promise<SessionData | undefined> => {
        const req = await ctx.switchToHttp().getRequest()
        return req.session
    },
)
