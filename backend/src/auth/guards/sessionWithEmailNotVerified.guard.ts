import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { ISessionResolver, SessionResolverProvider } from '../session/session.resolver'

@Injectable()
export class SessionWithEmailNotVerifiedGuard implements CanActivate {
    constructor(@Inject(SessionResolverProvider) private readonly sessionResolver: ISessionResolver) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const verifyEmailNotRequired = true
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        return this.sessionResolver.validateSession(request, response, verifyEmailNotRequired)
    }
}
