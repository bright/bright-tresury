import {CacheModule, Module} from "@nestjs/common";
import {AuthBlockchainController} from "./auth-blockchain.controller";
import {UsersModule} from "../../users/users.module";
import {SuperTokensModule} from "../supertokens/supertokens.module";
import {SessionModule} from "../session/session.module";
import {AuthBlockchainService} from "./auth-blockchain.service";

@Module({
    imports: [
        UsersModule,
        SessionModule,
        SuperTokensModule,
        CacheModule
    ],
    controllers: [AuthBlockchainController],
    providers: [AuthBlockchainService],
    exports: [AuthBlockchainService]
})
export class AuthBlockchainModule {
}
