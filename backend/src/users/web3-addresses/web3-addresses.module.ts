import { Module } from '@nestjs/common'
import { Web3AddressEntity } from './web3-address.entity'
import { DatabaseModule } from '../../database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Web3AddressesService } from './web3-addresses.service'
import { UserEntity } from '../user.entity'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity, Web3AddressEntity])],
    providers: [Web3AddressesService],
    exports: [Web3AddressesService],
})
export class Web3AddressesModule {}
