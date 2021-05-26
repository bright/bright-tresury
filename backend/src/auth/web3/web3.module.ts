import { Module } from '@nestjs/common'
import { Web3SignUpModule } from './signUp/web3-sign-up.module'
import { Web3SignInModule } from './signIn/web3-sign-in.module'
import { Web3AssociateModule } from './associate/web3-associate.module'
import { Web3AddressesModule } from './addresses/web3-addresses.module'

@Module({
    imports: [Web3SignUpModule, Web3SignInModule, Web3AssociateModule, Web3AddressesModule],
})
export class Web3Module {}
