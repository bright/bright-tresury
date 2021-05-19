import { Module } from '@nestjs/common'
import { UsersModule } from '../../../users/users.module'
import { SessionModule } from '../../session/session.module'
import { Web3AddressManagementController } from './web3-address-management.controller'

@Module({
    imports: [UsersModule, SessionModule],
    controllers: [Web3AddressManagementController],
})
export class Web3AddressManagementModule {}
