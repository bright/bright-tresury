import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserEntity } from '../../users/user.entity'

export interface SessionData {
    user: UserEntity
}

export const ReqSession = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext): Promise<SessionData | undefined> => {
        const req = await ctx.switchToHttp().getRequest()
        return req.session
    },
)
