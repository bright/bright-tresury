import { DatabaseModule } from '../database/database.module'
import { UserEntity } from './entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from './users.service'
import { forwardRef, Module } from '@nestjs/common'
import { Web3AddressEntity } from './web3-addresses/web3-address.entity'
import { Web3AddressesModule } from './web3-addresses/web3-addresses.module'
import { SignInAttemptModule } from './sign-in-attempt/sign-in-attempt.module'
import { UsersController } from './users.controller'
import { SessionModule } from '../auth/session/session.module'

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([UserEntity, Web3AddressEntity]),
        Web3AddressesModule,
        SignInAttemptModule,
        forwardRef(() => SessionModule),
    ],
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
