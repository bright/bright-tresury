import { CanActivate } from '@nestjs/common'
import { TestingModuleBuilder } from '@nestjs/testing'
import { SessionGuard } from '../../session/guard/session.guard'
import { ISessionResolver, SessionResolverProvider } from '../../session/session.resolver'

export const replaceSessionGuard = (fakeGuard: CanActivate): ((b: TestingModuleBuilder) => TestingModuleBuilder) => {
    const build = (builder: TestingModuleBuilder): TestingModuleBuilder => {
        return builder.overrideGuard(SessionGuard).useValue(fakeGuard)
    }
    return build
}

export const replaceSessionResolver = (
    sessionResolver: ISessionResolver,
): ((b: TestingModuleBuilder) => TestingModuleBuilder) => {
    const build = (builder: TestingModuleBuilder): TestingModuleBuilder => {
        return builder.overrideProvider(SessionResolverProvider).useValue(sessionResolver)
    }
    return build
}
