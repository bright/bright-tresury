import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { SessionModule } from './session/session.module'
import { UsersModule } from '../users/users.module'
import { Web3Module } from './web3/web3.module'

@Module({
    imports: [UsersModule, SessionModule, Web3Module],
    controllers: [AuthController],
})
export class AuthModule {}
