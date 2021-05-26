import { Module } from '@nestjs/common'
import { CachingModule } from '../../cache/cache.module'
import { BlockchainAddressesModule } from '../../users/blockchainAddresses/blockchainAddresses.module'
import { UsersModule } from '../../users/users.module'
import { SessionModule } from '../session/session.module'
import { SuperTokensModule } from '../supertokens/supertokens.module'
import { Web3SignMessageModule } from '../web3/signMessage/web3-sign-message.module'
import { Web3Module } from '../web3/web3.module'
import { EmailPasswordAssociateController } from './associate/email-password.associate.controller'
import { EmailPasswordAssociateService } from './associate/email-password.associate.service'

@Module({
    imports: [
        UsersModule,
        BlockchainAddressesModule,
        SessionModule,
        SuperTokensModule,
        CachingModule,
        Web3Module,
        Web3SignMessageModule,
    ],
    controllers: [EmailPasswordAssociateController],
    providers: [EmailPasswordAssociateService],
})
export class EmailPasswordModule {}
