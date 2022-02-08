import { v4 as uuid, validate } from 'uuid'
import { BadRequestException, ConflictException } from '@nestjs/common'
import { Response } from 'express'
import { UsersService } from '../../../users/users.service'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { beforeSetupFullApp } from '../../../utils/spec.helpers'
import { getAuthUser } from '../../supertokens/specHelpers/supertokens.database.spec.helper'
import { CreateWeb3UserDto } from '../../../users/dto/create-web3-user.dto'
import { SignatureValidator } from '../signMessage/signature.validator'
import { Web3SignUpService } from './web3-sign-up.service'
import { cleanDatabases } from '../web3.spec.helper'
import { ConfirmSignMessageRequestDto } from '../signMessage/dto/confirm-sign-message-request.dto'

describe(`Web3 Sign Up Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(Web3SignUpService)
    const getSignatureValidator = () => app.get().get(SignatureValidator)
    const getUsersService = () => app.get().get(UsersService)
    const getSuperTokensService = () => app.get().get(SuperTokensService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const aliceAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'
    const network = 'localhost'

    beforeEach(async () => {
        jest.spyOn(getSuperTokensService(), 'createSession').mockImplementation(() => Promise.resolve({} as any))

        await cleanDatabases()
    })

    describe('start sign up', () => {
        it('should return uuid', async () => {
            const signMessageResponse = await getService().start({ address: bobAddress })
            const isUuid = validate(signMessageResponse.signMessage)
            expect(isUuid).toBeTruthy()
        })
        it('should throw bad request if requested address is invalid', async () => {
            await expect(getService().start({ address: uuid() })).rejects.toThrow(BadRequestException)
        })
        it('should throw conflict if user with this address exists', async () => {
            await getUsersService().createWeb3User({
                authId: uuid(),
                username: bobUsername,
                web3Address: bobAddress,
            } as CreateWeb3UserDto)
            await expect(getService().start({ address: bobAddress })).rejects.toThrow(ConflictException)
        })
    })

    describe('confirm sign up', () => {
        it('should save users', async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)
            await getService().start({ address: bobAddress })
            await getService().confirm(
                {
                    signature: uuid(),
                    address: bobAddress,
                } as ConfirmSignMessageRequestDto,
                {} as Response,
            )

            const user = await getUsersService().findOneByWeb3Address(bobAddress)
            const superTokensUser = await getAuthUser(user.authId)
            expect(user).toBeDefined()
            expect(superTokensUser).toBeDefined()
        })
        it("should throw a bad request if address didn't start sign up", async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)
            await getService().start({ address: bobAddress })
            await expect(
                getService().confirm(
                    {
                        signature: uuid(),
                        address: aliceAddress,
                    } as ConfirmSignMessageRequestDto,
                    {} as Response,
                ),
            ).rejects.toThrow(BadRequestException)
        })
        it('should throw a bad request if requested signature is invalid', async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => false)
            await getService().start({ address: bobAddress })
            await expect(
                getService().confirm(
                    {
                        signature: uuid(),
                        address: bobAddress,
                    } as ConfirmSignMessageRequestDto,
                    {} as Response,
                ),
            ).rejects.toThrow(BadRequestException)
        })
    })
})
