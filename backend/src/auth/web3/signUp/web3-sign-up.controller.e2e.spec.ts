import { v4 as uuid } from 'uuid'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { UsersService } from '../../../users/users.service'
import { beforeSetupFullApp, request } from '../../../utils/spec.helpers'
import { getAuthUser } from '../../supertokens/specHelpers/supertokens.database.spec.helper'
import { createSessionHandler } from '../../supertokens/specHelpers/supertokens.session.spec.helper'
import { beforeEachWeb3E2eTest } from '../web3.spec.helper'

describe(`Web3 Sign Up Controller`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getUsersService = () => app.get().get(UsersService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        await beforeEachWeb3E2eTest(app)
    })

    describe('sign up', () => {
        it('should save user in both databases with verified email', async () => {
            await request(app()).post(`/api/v1/auth/web3/signup/start`).send({ address: bobAddress })

            await request(app())
                .post(`/api/v1/auth/web3/signup/confirm`)
                .send({
                    address: bobAddress,
                    details: { network: 'localhost' },
                    signature: uuid(),
                })

            const user = await getUsersService().findOneByWeb3Address(bobAddress)
            const superTokensUser = await getAuthUser(user.authId)
            const isEmailVerified = await getService().isEmailVerified(user)
            expect(user).toBeDefined()
            expect(superTokensUser).toBeDefined()
            expect(superTokensUser!.id).toBe(user.authId)
            expect(isEmailVerified).toBeTruthy()
        })
        it('should create session', async () => {
            await request(app()).post(`/api/v1/auth/web3/signup/start`).send({ address: bobAddress })

            const confirmSignUpResponse = await request(app())
                .post(`/api/v1/auth/web3/signup/confirm`)
                .send({
                    address: bobAddress,
                    details: { network: 'localhost' },
                    signature: uuid(),
                })
            const user = await getUsersService().findOneByWeb3Address(bobAddress)
            const sessionHandler = createSessionHandler(confirmSignUpResponse, user)
            const session = await getService().getSession(sessionHandler.getAuthorizedRequest(), {} as any, false)

            expect(session).toBeDefined()
        })
    })
})
