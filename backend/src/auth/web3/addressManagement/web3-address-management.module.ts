import { Module } from '@nestjs/common'
import { UsersModule } from '../../../users/users.module'
import { SessionModule } from '../../session/session.module'
import { Web3AddressManagementController } from './web3-address-management.controller'
import { SuperTokensModule } from '../../supertokens/supertokens.module'

@Module({
    imports: [UsersModule, SessionModule, SuperTokensModule],
    controllers: [Web3AddressManagementController],
})
export class Web3AddressManagementModule {}
