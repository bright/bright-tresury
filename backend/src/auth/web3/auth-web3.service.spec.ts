import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { UsersService } from '../../users/users.service'
import { cleanAuthorizationDatabase } from '../supertokens/specHelpers/supertokens.database.spec.helper'
import { AuthWeb3Service } from './auth-web3.service'
import { v4 as uuid } from 'uuid'
import { CreateBlockchainUserDto } from '../../users/dto/createBlockchainUser.dto'
import { SuperTokensService } from '../supertokens/supertokens.service'
import { Response } from 'express'
import { ConfirmWeb3SignUpRequestDto } from './dto/confirm-web3-sign-up-request.dto'
import { SignatureValidator } from './signingMessage/signature.validator'

describe(`Auth Web3 Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(AuthWeb3Service)
    const getSignatureValidator = () => app.get().get(SignatureValidator)
    const getUsersService = () => app.get().get(UsersService)
    const getSuperTokensService = () => app.get().get(SuperTokensService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const charlieAddress = '14Gjs1TD93gnwEBfDMHoCgsuf1s2TVKUP6Z1qKmAZnZ8cW5q'
    const network = 'localhost'

    beforeEach(async () => {
        jest.spyOn(getSuperTokensService(), 'createSession').mockImplementation(() => Promise.resolve({} as any))

        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    function mockSignatureValidation(result: boolean) {
        jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => result)
    }

    describe('simultaneous sign up and sign in', () => {
        it('is allowed', async () => {
            mockSignatureValidation(true)
            const createSessionSpy = jest.spyOn(getSuperTokensService(), 'createSession')
            const initialCallsCount = createSessionSpy.mock.calls.length
            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress,
            } as CreateBlockchainUserDto)

            await getService().startSignIn({ address: bobAddress })
            await getService().startSignUp({ address: charlieAddress })

            await getService().confirmSignIn(
                {
                    signature: uuid(),
                    address: bobAddress,
                } as ConfirmWeb3SignUpRequestDto,
                {} as Response,
            )
            expect(createSessionSpy.mock.calls.length).toBe(initialCallsCount + 1)

            await getService().confirmSignUp(
                {
                    signature: uuid(),
                    network,
                    address: charlieAddress,
                } as ConfirmWeb3SignUpRequestDto,
                {} as Response,
            )
            const charlieUser = await getUsersService().findOneByBlockchainAddress(charlieAddress)
            expect(charlieUser).toBeDefined()
        })
    })
})
