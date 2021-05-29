import { Module } from '@nestjs/common'
import { Web3Address } from './web3-address.entity'
import { DatabaseModule } from '../../database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Web3AddressesService } from './web3-addresses.service'
import { User } from '../user.entity'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([User, Web3Address])],
    providers: [Web3AddressesService],
    exports: [Web3AddressesService],
})
export class Web3AddressesModule {}
