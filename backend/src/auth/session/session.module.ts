import {MiddlewareConsumer, Module, RequestMethod} from "@nestjs/common";
import {SessionValidator} from "./session.validator";
import {UsersModule} from "../../users/users.module";
import {SessionUserMiddleware} from "./session.middleware";
import {SuperTokensModule} from "../supertokens/supertokens.module";

@Module({
    imports: [UsersModule, SuperTokensModule],
    providers: [SessionValidator],
    exports: [SessionValidator]
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
