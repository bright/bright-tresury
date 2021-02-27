import {Module} from "@nestjs/common";
import {SuperTokensService} from "./supertokens.service";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [UsersModule],
    providers: [SuperTokensService],
    exports: [SuperTokensService]
})
export class SuperTokensModule {
}
