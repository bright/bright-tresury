import { Module } from '@nestjs/common'
import { UsersModule } from '../../../users/users.module'
import { SessionModule } from '../../session/session.module'
import { SuperTokensModule } from '../../supertokens/supertokens.module'
import { Web3AddressesController } from './web3-addresses.controller'

@Module({
    imports: [UsersModule, SessionModule, SuperTokensModule],
    controllers: [Web3AddressesController],
})
export class Web3AddressesModule {}
