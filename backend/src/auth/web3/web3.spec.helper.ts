import { cleanDatabase, request } from '../../utils/spec.helpers'
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
import { BlockchainAddressesService } from '../../users/blockchainAddresses/blockchainAddresses.service'
import { CreateUserDto } from '../../users/dto/create-user.dto'
import { CreateBlockchainAddress } from '../../users/blockchainAddresses/create-blockchain-address'

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

export async function signInAndGetSessionHandler(
    app: Accessor<INestApplication>,
    address: string,
): Promise<SessionHandler> {
    const usersService = app.get().get(UsersService)
    const user = await usersService.create(new CreateUserDto(uuid(), 'Bob', 'bob@email.com'))
    const blockchainAddressService = app.get().get(BlockchainAddressesService)
    await blockchainAddressService.create(new CreateBlockchainAddress(address, user))

    await request(app()).post(`/api/v1/auth/web3/signin/start`).send({ address })
    const confirmSignInResponse = await request(app()).post(`/api/v1/auth/web3/signin/confirm`).send({
        address,
        signature: uuid(),
    })

    const signedUser = await usersService.findOneByBlockchainAddress(address)
    const handler = createSessionHandler(confirmSignInResponse, signedUser)
    await verifyEmail(app.get(), handler)
    return handler
}
