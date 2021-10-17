import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { ISessionResolver, SessionResolverProvider } from '../session/session.resolver'

/**
 * Use it in order to require authorised requests.
 * It will return HttpStatus 401 (Unauthorized) for any unauthorised user.
 */
@Injectable()
export class SessionGuard implements CanActivate {
    constructor(@Inject(SessionResolverProvider) private readonly sessionResolver: ISessionResolver) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        return this.sessionResolver.validateSession(request, response)
    }
}
