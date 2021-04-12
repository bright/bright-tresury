import {Module} from "@nestjs/common";
import {EmailsModule} from "../../emails/emails.module";
import {SuperTokensService} from "./supertokens.service";
import {UsersModule} from "../../users/users.module";

@Module({
    imports: [UsersModule, EmailsModule],
    providers: [SuperTokensService],
    exports: [SuperTokensService]
})
export class SuperTokensModule {
}
