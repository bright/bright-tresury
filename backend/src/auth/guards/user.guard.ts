import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

/**
 * Use it in order to check if param `userId` is equal to id of a user owning the session.
 * It will return HttpStatus 401 (Unauthorized) for any unauthorised user.
 */
@Injectable()
export class UserGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const sessionUserId = request.session?.user?.id
        const paramsUserId = request.params?.userId

        return sessionUserId && sessionUserId === paramsUserId
    }
}
