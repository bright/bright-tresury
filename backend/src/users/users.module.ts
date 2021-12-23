
import { DatabaseModule } from '../database/database.module'
import { UserEntity } from './user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from './users.service'
import { Module } from '@nestjs/common'
import { Web3AddressEntity } from './web3-addresses/web3-address.entity'
import { Web3AddressesModule } from './web3-addresses/web3-addresses.module'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity, Web3AddressEntity]), Web3AddressesModule],
    providers: [UsersService],
    exports: [UsersService],
    controllers: [],
})
export class UsersModule {}
