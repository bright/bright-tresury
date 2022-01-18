import { cleanDatabase, NETWORKS, request } from '../../utils/spec.helpers'
import { cleanAuthorizationDatabase } from '../supertokens/specHelpers/supertokens.database.spec.helper'
import { Accessor } from '../../utils/accessor'
import { SignatureValidator } from './signMessage/signature.validator'
import { INestApplication } from '@nestjs/common'
import {
    createSessionHandler,
    SessionHandler,
    verifyEmail,
} from '../supertokens/specHelpers/supertokens.session.spec.helper'
import { v4 as uuid } from 'uuid'
import { UsersService } from '../../users/users.service'
import { Web3AddressesService } from '../../users/web3-addresses/web3-addresses.service'
import { CreateUserDto } from '../../users/dto/create-user.dto'
import { CreateWeb3AddressDto } from '../../users/web3-addresses/create-web3-address.dto'

export async function beforeEachWeb3E2eTest(accessor: Accessor<INestApplication>): Promise<void> {
    /**
     * Mock signature validation so that we don't use real blockchain for signing.
     */
    jest.spyOn(accessor.get().get(SignatureValidator), 'validateSignature').mockImplementation((): boolean => true)
    await cleanDatabases()
}

export async function cleanDatabases() {
    await cleanDatabase()
    await cleanAuthorizationDatabase()
}
