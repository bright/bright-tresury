import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {SessionModule} from "./session/session.module";
import {SuperTokensModule} from "./supertokens/supertokens.module";
import {UsersModule} from "../users/users.module";
import {AuthBlockchainModule} from "./blockchain/auth-blockchain.module";

@Module({
    imports: [UsersModule, SessionModule, SuperTokensModule, AuthBlockchainModule],
    controllers: [AuthController]
})
export class AuthModule {
}
