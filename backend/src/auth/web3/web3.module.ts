import { Module } from '@nestjs/common'
import { Web3SignUpModule } from './signUp/web3-sign-up.module'
import { Web3SignInModule } from './signIn/web3-sign-in.module'
import { Web3AssociateModule } from './associate/web3-associate.module'

@Module({
    imports: [Web3SignUpModule, Web3SignInModule, Web3AssociateModule],
})
export class Web3Module {}
