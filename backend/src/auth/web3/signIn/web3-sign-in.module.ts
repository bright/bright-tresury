import { Module } from '@nestjs/common'
import { Web3SignMessageModule } from '../signMessage/web3-sign-message.module'
import { UsersModule } from '../../../users/users.module'
import { Web3AddressesModule } from '../../../users/web3-addresses/web3-addresses.module'
import { SessionModule } from '../../session/session.module'
import { SuperTokensModule } from '../../supertokens/supertokens.module'
import { Web3SignInController } from './web3-sign-in.controller'
import { Web3SignInService } from './web3-sign-in.service'

@Module({
    imports: [UsersModule, Web3AddressesModule, SessionModule, SuperTokensModule, Web3SignMessageModule],
    controllers: [Web3SignInController],
    providers: [Web3SignInService],
    exports: [Web3SignInService],
})
export class Web3SignInModule {}
