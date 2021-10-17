import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class MockSessionGuard implements CanActivate {
    allow: boolean = true

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return this.allow
    }
}
