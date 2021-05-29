import { Module } from '@nestjs/common'
import { CachingModule } from '../../cache/cache.module'
import { Web3AddressesModule } from '../../users/web3-addresses/web3-addresses.module'
import { UsersModule } from '../../users/users.module'
import { SessionModule } from '../session/session.module'
import { SuperTokensModule } from '../supertokens/supertokens.module'
import { Web3SignMessageModule } from '../web3/signMessage/web3-sign-message.module'
import { Web3Module } from '../web3/web3.module'
import { EmailPasswordAssociateController } from './associate/email-password.associate.controller'
import { EmailPasswordAssociateService } from './associate/email-password.associate.service'
import { VerifyEmailModule } from './verify-email/verify-email.module'

@Module({
    imports: [
        UsersModule,
        Web3AddressesModule,
        SessionModule,
        SuperTokensModule,
        CachingModule,
        Web3Module,
        Web3SignMessageModule,
        VerifyEmailModule,
    ],
    controllers: [EmailPasswordAssociateController],
    providers: [EmailPasswordAssociateService],
})
export class EmailPasswordModule {}
