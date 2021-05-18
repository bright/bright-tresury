import { Module } from '@nestjs/common'
import { Web3SignMessageModule } from '../signMessage/web3-sign-message.module'
import { UsersModule } from '../../../users/users.module'
import { BlockchainAddressModule } from '../../../users/blockchainAddress/blockchainAddress.module'
import { SessionModule } from '../../session/session.module'
import { SuperTokensModule } from '../../supertokens/supertokens.module'
import { CachingModule } from '../../../cache/cache.module'
import { Web3AssociateController } from './web3-associate.controller'
import { Web3AssociateService } from './web3-associate.service'

@Module({
    imports: [
        UsersModule,
        BlockchainAddressModule,
        SessionModule,
        SuperTokensModule,
        CachingModule,
        Web3SignMessageModule,
    ],
    controllers: [Web3AssociateController],
    providers: [Web3AssociateService],
    exports: [Web3AssociateService],
})
export class Web3AssociateModule {}
