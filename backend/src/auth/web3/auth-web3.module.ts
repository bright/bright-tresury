import {Module} from "@nestjs/common";
import {AuthWeb3Controller} from "./auth-web3.controller";
import {UsersModule} from "../../users/users.module";
import {SuperTokensModule} from "../supertokens/supertokens.module";
import {SessionModule} from "../session/session.module";
import {AuthWeb3Service} from "./auth-web3.service";
import {CachingModule} from "../../cache/cache.module";

@Module({
    imports: [
        UsersModule,
        SessionModule,
        SuperTokensModule,
        CachingModule
    ],
    controllers: [AuthWeb3Controller],
    providers: [AuthWeb3Service],
    exports: [AuthWeb3Service]
})
export class AuthWeb3Module {
}
