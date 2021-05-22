import { v4 as uuid } from 'uuid'
import { UsersService } from '../../../users/users.service'
import { beforeSetupFullApp, request } from '../../../utils/spec.helpers'
import { createBlockchainSessionHandler } from '../../supertokens/specHelpers/supertokens.session.spec.helper'
import { ConfirmSignMessageRequestDto } from '../signMessage/confirm-sign-message-request.dto'
import { beforeEachWeb3E2eTest } from '../web3.spec.helper'

describe(`Web3 Associate Controller`, () => {
    const app = beforeSetupFullApp()
    const getUsersService = () => app.get().get(UsersService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const charlieAddress = '14Gjs1TD93gnwEBfDMHoCgsuf1s2TVKUP6Z1qKmAZnZ8cW5q'

    beforeEach(async () => {
        await beforeEachWeb3E2eTest(app)
    })

    describe('associate', () => {
        it('should associate address', async () => {
            const sessionHandler = await createBlockchainSessionHandler(app.get(), bobAddress)
            await sessionHandler.authorizeRequest(
                request(app()).post('/api/v1/auth/web3/associate/start').send({ address: charlieAddress }),
            )
            await sessionHandler.authorizeRequest(
                request(app())
                    .post('/api/v1/auth/web3/associate/confirm')
                    .send({ address: charlieAddress, signature: uuid() } as ConfirmSignMessageRequestDto),
            )

            const userWithAssociatedAddress = await getUsersService().findOneByBlockchainAddress(bobAddress)

            const addresses = userWithAssociatedAddress.blockchainAddresses!.map(
                (blockchainAddress) => blockchainAddress.address,
            )

            expect(addresses).toContain(bobAddress)
            expect(addresses).toContain(charlieAddress)
        })
    })
})
