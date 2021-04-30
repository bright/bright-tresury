import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {SessionModule} from "./session/session.module";
import {SuperTokensModule} from "./supertokens/supertokens.module";
import {UsersModule} from "../users/users.module";
import {AuthWeb3Module} from "./web3/auth-web3.module";

@Module({
    imports: [UsersModule, SessionModule, SuperTokensModule, AuthWeb3Module],
    controllers: [AuthController]
})
export class AuthModule {
}
