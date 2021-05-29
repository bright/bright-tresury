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

export async function signInAndGetSessionHandler(
    app: Accessor<INestApplication>,
    address: string,
): Promise<SessionHandler> {
    const usersService = app.get().get(UsersService)
    const user = await usersService.create(new CreateUserDto(uuid(), 'Bob', 'bob@email.com'))
    const web3AddressesService = app.get().get(Web3AddressesService)
    await web3AddressesService.create(new CreateWeb3AddressDto(address, user))

    await request(app()).post(`/api/v1/auth/web3/signin/start`).send({ address })
    const confirmSignInResponse = await request(app()).post(`/api/v1/auth/web3/signin/confirm`).send({
        address,
        signature: uuid(),
    })

    const signedUser = await usersService.findOneByWeb3Address(address)
    const handler = createSessionHandler(confirmSignInResponse, signedUser)
    await verifyEmail(app.get(), handler)
    return handler
}
