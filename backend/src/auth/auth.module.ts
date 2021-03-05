import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {SessionModule} from "./session/session.module";
import {AuthService} from "./auth.service";
import {SuperTokensModule} from "./supertokens/supertokens.module";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [UsersModule, SessionModule, SuperTokensModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {
}
