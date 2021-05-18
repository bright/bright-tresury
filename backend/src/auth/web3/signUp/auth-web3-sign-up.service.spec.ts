import { v4 as uuid, validate } from 'uuid'
import { BadRequestException, ConflictException } from '@nestjs/common'
import { Response } from 'express'
import { AuthWeb3SignUpService } from './auth-web3-sign-up.service'
import { UsersService } from '../../../users/users.service'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { beforeSetupFullApp, cleanDatabase } from '../../../utils/spec.helpers'
import { cleanAuthorizationDatabase, getAuthUser } from '../../supertokens/specHelpers/supertokens.database.spec.helper'
import { CreateBlockchainUserDto } from '../../../users/dto/createBlockchainUser.dto'
import { ConfirmWeb3SignUpRequestDto } from '../dto/confirm-web3-sign-up-request.dto'
import { SignatureValidator } from '../signingMessage/signature.validator'

describe(`Auth Web3 Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(AuthWeb3SignUpService)
    const getSignatureValidator = () => app.get().get(SignatureValidator)
    const getUsersService = () => app.get().get(UsersService)
    const getSuperTokensService = () => app.get().get(SuperTokensService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const aliceAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'
    const network = 'localhost'

    beforeEach(async () => {
        jest.spyOn(getSuperTokensService(), 'createSession').mockImplementation(() => Promise.resolve({} as any))

        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('web3 start sign up', () => {
        it('should return uuid', async () => {
            const signMessageResponse = await getService().startSignMessage({ address: bobAddress })
            const isUuid = validate(signMessageResponse.signMessage)
            expect(isUuid).toBeTruthy()
        })
        it('should throw bad request if requested address is invalid', async () => {
            await expect(getService().startSignMessage({ address: uuid() })).rejects.toThrow(BadRequestException)
        })
        it('should throw conflict if user with this address exists', async () => {
            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress,
            } as CreateBlockchainUserDto)
            await expect(getService().startSignMessage({ address: bobAddress })).rejects.toThrow(ConflictException)
        })
    })

    describe('web3 confirm sign up', () => {
        it('should save users', async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)
            await getService().startSignMessage({ address: bobAddress })
            await getService().confirmSignMessage(
                {
                    signature: uuid(),
                    network,
                    address: bobAddress,
                } as ConfirmWeb3SignUpRequestDto,
                {} as Response,
            )

            const user = await getUsersService().findOneByBlockchainAddress(bobAddress)
            const superTokensUser = await getAuthUser(user.authId)
            expect(user).toBeDefined()
            expect(superTokensUser).toBeDefined()
        })
        it("should throw a bad request if address didn't start sign up", async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)
            await getService().startSignMessage({ address: bobAddress })
            await expect(
                getService().confirmSignMessage(
                    {
                        signature: uuid(),
                        network,
                        address: aliceAddress,
                    } as ConfirmWeb3SignUpRequestDto,
                    {} as Response,
                ),
            ).rejects.toThrow(BadRequestException)
        })
        it('should throw a bad request if requested signature is invalid', async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => false)
            await getService().startSignMessage({ address: bobAddress })
            await expect(
                getService().confirmSignMessage(
                    {
                        signature: uuid(),
                        network,
                        address: bobAddress,
                    } as ConfirmWeb3SignUpRequestDto,
                    {} as Response,
                ),
            ).rejects.toThrow(BadRequestException)
        })
    })
})
