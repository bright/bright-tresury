import { beforeSetupFullApp, cleanDatabase, request } from '../../utils/spec.helpers'
import { SuperTokensService } from '../supertokens/supertokens.service'
import { UsersService } from '../../users/users.service'
import { createSessionHandler } from '../supertokens/specHelpers/supertokens.session.spec.helper'
import { cleanAuthorizationDatabase, getAuthUser } from '../supertokens/specHelpers/supertokens.database.spec.helper'
import { v4 as uuid } from 'uuid'
import { CreateBlockchainUserDto } from '../../users/dto/createBlockchainUser.dto'
import { AuthWeb3SignInService } from './signIn/auth-web3-sign-in.service'
import { SignatureValidator } from './signingMessage/signature.validator'

describe(`Auth Web3 Controller`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getSignatureValidator = () => app.get().get(SignatureValidator)
    const getSignUpService = () => app.get().get(AuthWeb3SignInService)
    const getUsersService = () => app.get().get(UsersService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        /**
         * Mock signature validation so that we don't use real blockchain for signing.
         */
        jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('sign up', () => {
        it('should save user in both databases', async () => {
            await request(app()).post(`/api/v1/auth/web3/signup/start`).send({ address: bobAddress })

            await request(app()).post(`/api/v1/auth/web3/signup/confirm`).send({
                address: bobAddress,
                network: 'localhost',
                signature: uuid(),
            })

            const user = await getUsersService().findOneByBlockchainAddress(bobAddress)
            const superTokensUser = await getAuthUser(user.authId)

            expect(user).toBeDefined()
            expect(superTokensUser).toBeDefined()
            expect(superTokensUser!.id).toBe(user.authId)
        })
        it('should create session', async () => {
            await request(app()).post(`/api/v1/auth/web3/signup/start`).send({ address: bobAddress })

            const confirmSignUpResponse = await request(app()).post(`/api/v1/auth/web3/signup/confirm`).send({
                address: bobAddress,
                network: 'localhost',
                signature: uuid(),
            })
            const user = await getUsersService().findOneByBlockchainAddress(bobAddress)
            const sessionHandler = createSessionHandler(confirmSignUpResponse, user)
            const session = await getService().getSession(sessionHandler.getAuthorizedRequest(), {} as any, false)

            expect(session).toBeDefined()
        })
    })

    describe('sign in', () => {
        it('should create session', async () => {
            await getUsersService().createBlockchainUser(new CreateBlockchainUserDto(uuid(), 'Bob', bobAddress))
            await request(app()).post(`/api/v1/auth/web3/signin/start`).send({ address: bobAddress })

            const confirmSignInResponse = await request(app()).post(`/api/v1/auth/web3/signin/confirm`).send({
                address: bobAddress,
                signature: uuid(),
            })
            const user = await getUsersService().findOneByBlockchainAddress(bobAddress)
            const sessionHandler = createSessionHandler(confirmSignInResponse, user)
            const session = await getService().getSession(sessionHandler.getAuthorizedRequest(), {} as any, false)

            expect(session).toBeDefined()
        })
    })
})
