import { UsersService } from '../../../users/users.service'
import { beforeSetupFullApp, request } from '../../../utils/spec.helpers'
import { beforeEachWeb3E2eTest, signInAndGetSessionHandler } from '../web3.spec.helper'
import { HttpStatus } from '@nestjs/common'

describe(`Web3 Addresses Controller`, () => {
    const app = beforeSetupFullApp()
    const getUsersService = () => app.get().get(UsersService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const charlieAddress = '14Gjs1TD93gnwEBfDMHoCgsuf1s2TVKUP6Z1qKmAZnZ8cW5q'

    beforeEach(async () => {
        await beforeEachWeb3E2eTest(app)
    })

    describe('delete', () => {
        it('should delete address', async () => {
            const sessionHandler = await signInAndGetSessionHandler(app, bobAddress)
            await getUsersService().associateWeb3Address(sessionHandler.sessionData.user, charlieAddress)

            await sessionHandler.authorizeRequest(
                request(app()).del(`/api/v1/auth/web3/addresses/${charlieAddress}`).send(),
            )

            const userAfterUnlinking = await getUsersService().findOne(sessionHandler.sessionData.user.id)
            expect(userAfterUnlinking.web3Addresses!.length).toBe(1)
            expect(userAfterUnlinking.web3Addresses![0].address).toBe(bobAddress)
        })
        it('should throw forbidden exception if not signed in', () => {
            return request(app())
                .del(`/api/v1/auth/web3/addresses/${charlieAddress}`)
                .send()
                .expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('make primary', () => {
        it('should make address primary', async () => {
            const sessionHandler = await signInAndGetSessionHandler(app, bobAddress)
            await getUsersService().associateWeb3Address(sessionHandler.sessionData.user, charlieAddress)

            await sessionHandler.authorizeRequest(
                request(app()).post(`/api/v1/auth/web3/addresses/${charlieAddress}/make-primary`).send(),
            )

            const userAfterMakingAddressPrimary = await getUsersService().findOne(sessionHandler.sessionData.user.id)
            const charlieWeb3Address = userAfterMakingAddressPrimary.web3Addresses!.find(
                (bAddress) => bAddress.address === charlieAddress,
            )
            expect(charlieWeb3Address!.isPrimary).toBeTruthy()
            const bobWeb3Address = userAfterMakingAddressPrimary.web3Addresses!.find(
                (bAddress) => bAddress.address === bobAddress,
            )
            expect(bobWeb3Address!.isPrimary).toBeFalsy()
        })
        it('should throw forbidden exception if not signed in', () => {
            return request(app())
                .post(`/api/v1/auth/web3/addresses/${charlieAddress}/make-primary`)
                .send({ address: charlieAddress })
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
