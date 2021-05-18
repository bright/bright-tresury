import { v4 as uuid } from 'uuid'
import { UsersService } from '../../../users/users.service'
import { beforeSetupFullApp, request } from '../../../utils/spec.helpers'
import { CreateBlockchainUserDto } from '../../../users/dto/createBlockchainUser.dto'
import { createSessionHandler } from '../../supertokens/specHelpers/supertokens.session.spec.helper'
import { ConfirmSignMessageRequestDto } from '../signMessage/confirm-sign-message-request.dto'
import { beforeEachWeb3E2eTest } from '../web3.spec.helper'

describe(`Web3 Associate Controller`, () => {
    const app = beforeSetupFullApp()
    const getUsersService = () => app.get().get(UsersService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const charlieAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        await beforeEachWeb3E2eTest(app)
    })

    describe('associate', () => {
        it('should associate address', async () => {
            await getUsersService().createBlockchainUser(new CreateBlockchainUserDto(uuid(), 'Bob', bobAddress))
            await request(app()).post(`/api/v1/auth/web3/signin/start`).send({ address: bobAddress })

            const confirmSignInResponse = await request(app()).post(`/api/v1/auth/web3/signin/confirm`).send({
                address: bobAddress,
                signature: uuid(),
            })
            const user = await getUsersService().findOneByBlockchainAddress(bobAddress)
            const sessionHandler = createSessionHandler(confirmSignInResponse, user)
            sessionHandler.authorizeRequest(
                request(app()).post('/api/v1/auth/web3/associate/start').send({ address: charlieAddress }),
            )
            sessionHandler.authorizeRequest(
                request(app())
                    .post('/api/v1/auth/web3/associate/confirm')
                    .send({ address: charlieAddress, signature: uuid() } as ConfirmSignMessageRequestDto),
            )

            const userWithAssociatedAddress = await getUsersService().findOne(user.id)
            const addresses = userWithAssociatedAddress.blockchainAddresses!.map(
                (blockchainAddress) => blockchainAddress.address,
            )
            expect(addresses).toContain(bobAddress)
            expect(addresses).toContain(charlieAddress)
        })
    })
})
