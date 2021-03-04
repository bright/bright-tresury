import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {SessionModule} from "./session/session.module";

@Module({
    imports: [SessionModule],
    controllers: [AuthController]
})
export class AuthModule {
}
