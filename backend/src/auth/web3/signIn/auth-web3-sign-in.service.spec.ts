import { AuthWeb3SignInService } from './auth-web3-sign-in.service'
import { UsersService } from '../../../users/users.service'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { cleanAuthorizationDatabase } from '../../supertokens/specHelpers/supertokens.database.spec.helper'
import { beforeSetupFullApp, cleanDatabase } from '../../../utils/spec.helpers'
import { v4 as uuid } from 'uuid'
import { CreateBlockchainUserDto } from '../../../users/dto/createBlockchainUser.dto'
import { Response } from 'express'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { SignatureValidator } from '../signingMessage/signature.validator'

describe(`Auth Web3 Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(AuthWeb3SignInService)
    const getSignatureValidator = () => app.get().get(SignatureValidator)
    const getUsersService = () => app.get().get(UsersService)
    const getSuperTokensService = () => app.get().get(SuperTokensService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const aliceAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'

    beforeEach(async () => {
        jest.spyOn(getSuperTokensService(), 'createSession').mockImplementation(() => Promise.resolve({} as any))

        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('start sign in', () => {
        it('returns uuid', async () => {
            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress,
            } as CreateBlockchainUserDto)

            const signMessageResponse = await getService().startSigningMessage({ address: bobAddress })
            expect(signMessageResponse.signMessage).toBeDefined()
        })
        it('is allowed with invalid address', async () => {
            const response = getService().startSigningMessage({ address: uuid() })
            expect(response).toBeDefined()
        })
        it('is allowed even if user with this address does not exist', async () => {
            const response = getService().startSigningMessage({ address: bobAddress })
            expect(response).toBeDefined()
        })
    })
    describe('confirm sign in', () => {
        it('creates session', async () => {
            const createSessionSpy = jest.spyOn(getSuperTokensService(), 'createSession')
            const initialCallsCount = createSessionSpy.mock.calls.length
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)

            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress,
            } as CreateBlockchainUserDto)
            await getService().startSigningMessage({ address: bobAddress })
            await getService().confirmSigningMessage(
                {
                    signature: uuid(),
                    address: bobAddress,
                },
                {} as Response,
            )

            expect(createSessionSpy.mock.calls.length).toBe(initialCallsCount + 1)
        })
        it("throws not found if sign in for requested address haven't started", async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)
            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress,
            } as CreateBlockchainUserDto)
            await getService().startSigningMessage({ address: bobAddress })

            await expect(
                getService().confirmSigningMessage(
                    {
                        signature: uuid(),
                        address: aliceAddress,
                    },
                    {} as Response,
                ),
            ).rejects.toThrow(BadRequestException)
        })
        it('throws conflict if signature was valid, but user with this address does not exist', async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)
            await getService().startSigningMessage({ address: bobAddress })
            await expect(
                getService().confirmSigningMessage(
                    {
                        signature: uuid(),
                        address: bobAddress,
                    },
                    {} as Response,
                ),
            ).rejects.toThrow(NotFoundException)
        })
        it('throws bad request when signature is invalid', async () => {
            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress,
            } as CreateBlockchainUserDto)
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => false)
            await getService().startSigningMessage({ address: bobAddress })

            await expect(
                getService().confirmSigningMessage(
                    {
                        signature: uuid(),
                        address: bobAddress,
                    },
                    {} as Response,
                ),
            ).rejects.toThrow(BadRequestException)
        })
    })
})
