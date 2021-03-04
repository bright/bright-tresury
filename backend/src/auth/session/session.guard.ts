import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {SessionValidator} from "./session.validator";

/**
 * Use it in order to require authorised requests.
 * It will return HttpStatus 401 (Unauthorized) for any unauthorised user.
 */
@Injectable()
export class SessionGuard implements CanActivate {

    constructor(
        private readonly sessionValidator: SessionValidator
    ) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return this.sessionValidator.validateSession(request, response);
    }
}
