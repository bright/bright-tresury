import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthMiddleware } from './auth.middleware'
import { EmailPasswordModule } from './email-password/email-password.module'
import { SessionModule } from './session/session.module'
import { SupertokensInitService } from './supertokens-init.service'
import { SuperTokensModule } from './supertokens/supertokens.module'
import { Web3Module } from './web3/web3.module'

@Module({
    providers: [SupertokensInitService],
    exports: [],
    imports: [UsersModule, SessionModule, SuperTokensModule, EmailPasswordModule, Web3Module, ConfigModule],
    controllers: [AuthController],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('*')
    }
}
