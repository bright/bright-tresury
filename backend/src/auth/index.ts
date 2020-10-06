import { Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { AuthService } from "./auth.service";
import { ConfigModule } from "../config/config";

@Module({
    imports: [ConfigModule],
    providers: [JwtStrategy, AuthService]
})
export class AuthModule {
}
