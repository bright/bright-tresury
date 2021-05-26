import { DatabaseModule } from '../database/database.module'
import { User } from './user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from './users.service'
import { Module } from '@nestjs/common'
import { BlockchainAddress } from './blockchainAddresses/blockchainAddress.entity'
import { BlockchainAddressesModule } from './blockchainAddresses/blockchainAddresses.module'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([User, BlockchainAddress]), BlockchainAddressesModule],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
