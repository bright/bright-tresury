import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { UsersService } from '../../users/users.service'
import { cleanAuthorizationDatabase, getAuthUser } from '../supertokens/specHelpers/supertokens.database.spec.helper'
import { AuthWeb3Service } from './auth-web3.service'
import { v4 as uuid, validate } from 'uuid'
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { CreateBlockchainUserDto } from '../../users/dto/createBlockchainUser.dto'
import { SuperTokensService } from '../supertokens/supertokens.service'
import { Response } from 'express'
import { ConfirmWeb3SignUpRequestDto } from './dto/confirm-web3-sign-up-request.dto'
import { ConfirmWeb3SignRequestDto } from './dto/confirm-web3-sign-request.dto'

describe(`Auth Web3 Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(AuthWeb3Service)
    const getUsersService = () => app.get().get(UsersService)
    const getSuperTokensService = () => app.get().get(SuperTokensService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const aliceAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'
    const charlieAddress = '14Gjs1TD93gnwEBfDMHoCgsuf1s2TVKUP6Z1qKmAZnZ8cW5q'
    const network = 'localhost'

    beforeEach(async () => {
        jest.spyOn(getSuperTokensService(), 'createSession').mockImplementation(() => Promise.resolve({} as any))

        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('web3 start sign up', () => {
        it('should return uuid', async () => {
            const signMessageResponse = await getService().startSignUp({ address: bobAddress })
            const isUuid = validate(signMessageResponse.signMessage)
            expect(isUuid).toBeTruthy()
        })
        it('should throw bad request if requested address is invalid', async () => {
            await expect(getService().startSignUp({ address: uuid() })).rejects.toThrow(BadRequestException)
        })
        it('should throw conflict if user with this address exists', async () => {
            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress,
            } as CreateBlockchainUserDto)
            await expect(getService().startSignUp({ address: bobAddress })).rejects.toThrow(ConflictException)
        })
    })
    describe('web3 confirm sign up', () => {
        it('should save users', async () => {
            jest.spyOn(getService(), 'validateSignature').mockImplementation((): boolean => true)
            await getService().startSignUp({ address: bobAddress })
            await getService().confirmSignUp(
                {
                    signature: uuid(),
                    network,
                    address: bobAddress,
                },
                {} as Response,
            )

            const user = await getUsersService().findOneByBlockchainAddress(bobAddress)
            const superTokensUser = await getAuthUser(user.authId)
            expect(user).toBeDefined()
            expect(superTokensUser).toBeDefined()
        })
        it("should throw a not found if address didn't start sign up", async () => {
            jest.spyOn(getService(), 'validateSignature').mockImplementation((): boolean => true)
            await getService().startSignUp({ address: bobAddress })
            await expect(
                getService().confirmSignUp(
                    {
                        signature: uuid(),
                        network,
                        address: aliceAddress,
                    },
                    {} as Response,
                ),
            ).rejects.toThrow(NotFoundException)
        })
        it('should throw a bad request if requested signature is invalid', async () => {
            jest.spyOn(getService(), 'validateSignature').mockImplementation((): boolean => false)
            await getService().startSignUp({ address: bobAddress })
            await expect(
                getService().confirmSignUp(
                    {
                        signature: uuid(),
                        network,
                        address: bobAddress,
                    },
                    {} as Response,
                ),
            ).rejects.toThrow(BadRequestException)
        })
    })

    describe('start sign in', () => {
        it('returns uuid', async () => {
            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress,
            } as CreateBlockchainUserDto)

            const signMessageResponse = await getService().startSignIn({ address: bobAddress })
            expect(signMessageResponse.signMessage).toBeDefined()
        })
        it('throws bad request if invalid address', async () => {
            await expect(getService().startSignIn({ address: uuid() })).rejects.toThrow(BadRequestException)
        })
        it('throws conflict if user with this address does not exist', async () => {
            await expect(getService().startSignIn({ address: bobAddress })).rejects.toThrow(NotFoundException)
        })
    })
    describe('confirm sign in', () => {
        it('in creates session', async () => {
            const createSessionSpy = jest.spyOn(getSuperTokensService(), 'createSession')
            const initialCallsCount = createSessionSpy.mock.calls.length
            jest.spyOn(getService(), 'validateSignature').mockImplementation((): boolean => true)

            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress,
            } as CreateBlockchainUserDto)
            await getService().startSignIn({ address: bobAddress })
            await getService().confirmSignIn(
                {
                    signature: uuid(),
                    address: bobAddress,
                },
                {} as Response,
            )

            expect(createSessionSpy.mock.calls.length).toBe(initialCallsCount + 1)
        })
        it("throws not found if sign in for requested address haven't started", async () => {
            jest.spyOn(getService(), 'validateSignature').mockImplementation((): boolean => true)
            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress,
            } as CreateBlockchainUserDto)
            await getService().startSignIn({ address: bobAddress })

            await expect(
                getService().confirmSignIn(
                    {
                        signature: uuid(),
                        address: aliceAddress,
                    },
                    {} as Response,
                ),
            ).rejects.toThrow(NotFoundException)
        })
        it('throws conflict if user with this address does not exist', async () => {
            await expect(getService().startSignIn({ address: bobAddress })).rejects.toThrow(NotFoundException)
        })
        it('throws bad request when signature is invalid', async () => {
            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress,
            } as CreateBlockchainUserDto)
            jest.spyOn(getService(), 'validateSignature').mockImplementation((): boolean => false)
            await getService().startSignIn({ address: bobAddress })

            await expect(
                getService().confirmSignIn(
                    {
                        signature: uuid(),
                        address: bobAddress,
                    },
                    {} as Response,
                ),
            ).rejects.toThrow(BadRequestException)
        })
    })
    describe('simultaneous sign up and sign in', () => {
        it('is allowed', async () => {
            jest.spyOn(getService(), 'validateSignature').mockImplementation((): boolean => true)
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
                } as ConfirmWeb3SignRequestDto,
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
