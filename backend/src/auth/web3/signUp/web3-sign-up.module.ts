import { Module } from '@nestjs/common'
import { Web3SignMessageModule } from '../signMessage/web3-sign-message.module'
import { UsersModule } from '../../../users/users.module'
import { Web3AddressesModule } from '../../../users/web3-addresses/web3-addresses.module'
import { SessionModule } from '../../session/session.module'
import { SuperTokensModule } from '../../supertokens/supertokens.module'
import { Web3SignUpController } from './web3-sign-up.controller'
import { Web3SignUpService } from './web3-sign-up.service'

@Module({
    imports: [UsersModule, Web3AddressesModule, SessionModule, SuperTokensModule, Web3SignMessageModule],
    controllers: [Web3SignUpController],
    providers: [Web3SignUpService],
    exports: [Web3SignUpService],
})
export class Web3SignUpModule {}
