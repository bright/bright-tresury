import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { SessionResolver, SessionResolverProvider } from './session.resolver'
import { SessionUserMiddleware } from './session.middleware'
import { SuperTokensModule } from '../supertokens/supertokens.module'

@Module({
    imports: [SuperTokensModule],
    providers: [
        {
            provide: SessionResolverProvider,
            useClass: SessionResolver,
        },
    ],
    exports: [
        {
            provide: SessionResolverProvider,
            useClass: SessionResolver,
        },
    ],
})
export class SessionModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(SessionUserMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
    }
}
