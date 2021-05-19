import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { UsersService } from '../../users/users.service'
import { cleanAuthorizationDatabase } from '../supertokens/specHelpers/supertokens.database.spec.helper'
import { v4 as uuid } from 'uuid'
import { CreateBlockchainUserDto } from '../../users/dto/createBlockchainUser.dto'
import { SuperTokensService } from '../supertokens/supertokens.service'
import { Response } from 'express'
import { ConfirmWeb3SignUpRequestDto } from './signUp/dto/confirm-web3-sign-up-request.dto'
import { SignatureValidator } from './signMessage/signature.validator'
import { Web3SignUpService } from './signUp/web3-sign-up.service'
import { Web3SignInService } from './signIn/web3-sign-in.service'

describe(`Auth Web3 Service`, () => {
    const app = beforeSetupFullApp()
    const getSignUpService = () => app.get().get(Web3SignUpService)
    const getSignInService = () => app.get().get(Web3SignInService)
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

            await getSignInService().startSignMessage({ address: bobAddress })
            await getSignUpService().startSignMessage({ address: charlieAddress })

            await getSignInService().confirmSignMessage(
                {
                    signature: uuid(),
                    address: bobAddress,
                } as ConfirmWeb3SignUpRequestDto,
                {} as Response,
            )
            expect(createSessionSpy.mock.calls.length).toBe(initialCallsCount + 1)

            await getSignUpService().confirmSignMessage(
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