import { DatabaseModule } from '../database/database.module'
import { User } from './user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from './users.service'
import { Module } from '@nestjs/common'
import { Web3Address } from './web3-addresses/web3-address.entity'
import { Web3AddressesModule } from './web3-addresses/web3-addresses.module'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([User, Web3Address]), Web3AddressesModule],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
