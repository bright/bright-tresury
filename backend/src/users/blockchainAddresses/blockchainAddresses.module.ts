import { Module } from '@nestjs/common'
import { BlockchainAddress } from './blockchainAddress.entity'
import { DatabaseModule } from '../../database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockchainAddressesService } from './blockchainAddresses.service'
import { User } from '../user.entity'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([User, BlockchainAddress])],
    providers: [BlockchainAddressesService],
    exports: [BlockchainAddressesService],
})
export class BlockchainAddressesModule {}
