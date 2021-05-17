import { Module } from '@nestjs/common'
import { AuthWeb3Controller } from './auth-web3.controller'
import { UsersModule } from '../../users/users.module'
import { SuperTokensModule } from '../supertokens/supertokens.module'
import { SessionModule } from '../session/session.module'
import { AuthWeb3Service } from './auth-web3.service'
import { CachingModule } from '../../cache/cache.module'
import { BlockchainAddressModule } from '../../users/blockchainAddress/blockchainAddress.module'
import { AuthWeb3SignInService } from './signIn/auth-web3-sign-in.service'
import { AuthWeb3SignUpService } from './signUp/auth-web3-sign-up.service'
import { SignatureValidator } from './signingMessage/signature.validator'
import { AuthWeb3AssociateService } from './associate/auth-web3-associate.service'

@Module({
    imports: [UsersModule, BlockchainAddressModule, SessionModule, SuperTokensModule, CachingModule],
    controllers: [AuthWeb3Controller],
    providers: [
        AuthWeb3Service,
        AuthWeb3SignUpService,
        AuthWeb3SignInService,
        AuthWeb3AssociateService,
        SignatureValidator,
    ],
    exports: [AuthWeb3Service],
})
export class AuthWeb3Module {}
