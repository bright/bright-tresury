import { Module } from '@nestjs/common'
import { Web3SignMessageModule } from '../signMessage/web3-sign-message.module'
import { UsersModule } from '../../../users/users.module'
import { SessionModule } from '../../session/session.module'
import { Web3AssociateController } from './web3-associate.controller'
import { Web3AssociateService } from './web3-associate.service'
import { SuperTokensModule } from '../../supertokens/supertokens.module'
import { BlockchainAddressModule } from '../../../users/blockchainAddress/blockchainAddress.module'

@Module({
    imports: [UsersModule, BlockchainAddressModule, SessionModule, Web3SignMessageModule, SuperTokensModule],
    controllers: [Web3AssociateController],
    providers: [Web3AssociateService],
    exports: [Web3AssociateService],
})
export class Web3AssociateModule {}
