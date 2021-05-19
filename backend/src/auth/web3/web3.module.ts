import { Module } from '@nestjs/common'
import { Web3SignUpModule } from './signUp/web3-sign-up.module'
import { Web3SignInModule } from './signIn/web3-sign-in.module'
import { Web3AssociateModule } from './associate/web3-associate.module'
import { Web3AddressManagementModule } from './addressManagement/web3-address-management.module'

@Module({
    imports: [Web3SignUpModule, Web3SignInModule, Web3AssociateModule, Web3AddressManagementModule],
})
export class Web3Module {}
