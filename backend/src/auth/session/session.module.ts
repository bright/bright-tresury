import {MiddlewareConsumer, Module, RequestMethod} from "@nestjs/common";
import {SessionResolver, SessionResolverProvider} from "./session.resolver";
import {UsersModule} from "../../users/users.module";
import {SessionUserMiddleware} from "./session.middleware";
import {SuperTokensModule} from "../supertokens/supertokens.module";

@Module({
    imports: [UsersModule, SuperTokensModule],
    providers: [{
        provide: SessionResolverProvider,
        useClass: SessionResolver
    }],
    exports: [{
        provide: SessionResolverProvider,
        useClass: SessionResolver
    }]
})
export class SessionModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(SessionUserMiddleware)
            .forRoutes(
                {path: '*', method: RequestMethod.ALL},
            );
    }
}
