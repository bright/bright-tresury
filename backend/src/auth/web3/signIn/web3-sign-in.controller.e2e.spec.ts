import { v4 as uuid } from 'uuid'
import { beforeSetupFullApp, request } from '../../../utils/spec.helpers'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { UsersService } from '../../../users/users.service'
import { createSessionHandler } from '../../supertokens/specHelpers/supertokens.session.spec.helper'
import { CreateBlockchainUserDto } from '../../../users/dto/createBlockchainUser.dto'
import { beforeEachWeb3E2eTest } from '../web3.spec.helper'

describe(`Web3 Sign In Controller`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getUsersService = () => app.get().get(UsersService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        await beforeEachWeb3E2eTest(app)
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
