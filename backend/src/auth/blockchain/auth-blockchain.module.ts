import {Module} from "@nestjs/common";
import {AuthBlockchainController} from "./auth-blockchain.controller";
import {UsersModule} from "../../users/users.module";
import {SuperTokensModule} from "../supertokens/supertokens.module";
import {SessionModule} from "../session/session.module";
import {AuthBlockchainService} from "./auth-blockchain.service";
import {CachingModule} from "../../cache/cache.module";

@Module({
    imports: [
        UsersModule,
        SessionModule,
        SuperTokensModule,
        CachingModule
    ],
    controllers: [AuthBlockchainController],
    providers: [AuthBlockchainService],
    exports: [AuthBlockchainService]
})
export class AuthBlockchainModule {
}
