import {MiddlewareConsumer, Module, RequestMethod} from "@nestjs/common";
import {SessionValidator} from "./session.validator";
import {UsersModule} from "../../users/users.module";
import {SessionUserMiddleware} from "./session.middleware";

@Module({
    imports: [UsersModule],
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
