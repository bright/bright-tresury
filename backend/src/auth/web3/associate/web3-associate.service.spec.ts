import {BadRequestException} from '@nestjs/common'
import {v4 as uuid, validate} from 'uuid'
import {CreateBlockchainUserDto} from '../../../users/dto/create-blockchain-user.dto'
import {User} from "../../../users/user.entity";
import {UsersService} from '../../../users/users.service'
import {beforeSetupFullApp} from '../../../utils/spec.helpers'
import {cleanAuthorizationDatabase} from "../../supertokens/specHelpers/supertokens.database.spec.helper";
import {createBlockchainSessionHandler, createUserSessionHandler, SessionHandler} from '../../supertokens/specHelpers/supertokens.session.spec.helper'
import {SuperTokensService} from '../../supertokens/supertokens.service'
import {SignatureValidator} from '../signMessage/signature.validator'
import {cleanDatabases} from '../web3.spec.helper'
import {Web3AssociateService} from './web3-associate.service'

describe(`Web3 Associate Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(Web3AssociateService)
    const getSignatureValidator = () => app.get().get(SignatureValidator)
    const getUsersService = () => app.get().get(UsersService)
    const getSuperTokensService = () => app.get().get(SuperTokensService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const charlieAddress = '14Gjs1TD93gnwEBfDMHoCgsuf1s2TVKUP6Z1qKmAZnZ8cW5q'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        jest.spyOn(getSuperTokensService(), 'createSession').mockImplementation(() => Promise.resolve({} as any))

        await cleanDatabases()
        await cleanAuthorizationDatabase()
    })

    describe('adding web3 account to email only account', async () => {
        let sessionHandler: SessionHandler
        const password = uuid()
        beforeEach(async () => {
            sessionHandler = await createUserSessionHandler(app.get(), 'bob@example.com', 'bob', password)
        })

        describe('start', async () => {
            it('should return uuid', async () => {
                const signMessageResponse = await getService().start({address: bobAddress, password}, sessionHandler.sessionData)
                expect(signMessageResponse.signMessage).toBeDefined()
                expect(validate(signMessageResponse.signMessage)).toBe(true)
            })

            it('should require password', async () => {
                await expect(getService().start({address: bobAddress}, sessionHandler.sessionData))
                    .rejects
                    .toThrow(BadRequestException)
            })

            it('should allow invalid address', async () => {
                await expect(await getService().start({address: uuid(), password}, sessionHandler.sessionData)).resolves
            })
        })

        describe('confirm', () => {
            beforeEach(async () => {
                await getService().start({address: bobAddress, password}, sessionHandler.sessionData)
            })

            it('should associate account and make primary', async () => {
                jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementationOnce((): boolean => true)

                await getService().confirm(
                    {
                        signature: uuid(),
                        address: bobAddress,
                    },
                    sessionHandler.sessionData,
                )

                const actualUser = await getUsersService().findOne(sessionHandler.sessionData.user.id)
                expect(actualUser.blockchainAddresses!.length).toBe(1)
                expect(actualUser.blockchainAddresses![0].address).toBe(bobAddress)
                expect(actualUser.blockchainAddresses![0].isPrimary).toBe(true)
            })
            it('throws bad request when signature is invalid', async () => {
                jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementationOnce((): boolean => false)

                await expect(
                    getService().confirm(
                        {
                            signature: uuid(),
                            address: bobAddress,
                        },
                        sessionHandler.sessionData,
                    ),
                ).rejects.toThrow(BadRequestException)
            })
        })
    })

    describe('adding web3 account to web3 only account', async () => {
        let sessionHandler: SessionHandler
        const password = uuid()
        beforeEach(async () => {
            sessionHandler = await createBlockchainSessionHandler(app.get(), charlieAddress)
        })

        describe('start', async () => {
            it('should return uuid without password', async () => {
                const signMessageResponse = await getService().start({address: bobAddress}, sessionHandler.sessionData)
                expect(signMessageResponse.signMessage).toBeDefined()
                expect(validate(signMessageResponse.signMessage)).toBe(true)
            })

            it('should allow invalid address and no password', async () => {
                await expect(await getService().start({address: uuid()}, sessionHandler.sessionData)).resolves
            })
        })

        describe('confirm', () => {
            beforeEach(async () => {
                await getService().start({address: bobAddress}, sessionHandler.sessionData)
            })

            it('should associate account and NOT make primary', async () => {
                jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementationOnce((): boolean => true)

                await getService().confirm(
                    {
                        signature: uuid(),
                        address: bobAddress,
                    },
                    sessionHandler.sessionData,
                )

                const actualUser = await getUsersService().findOne(sessionHandler.sessionData.user.id)
                expect(actualUser.blockchainAddresses!.length).toBe(2)
                const addedBlockchainAddress = actualUser.blockchainAddresses?.find((address) => address.address === bobAddress)
                expect(addedBlockchainAddress).toBeDefined()
                expect(addedBlockchainAddress!.isPrimary).toBe(false)
            })

            it('throws bad request when signature is invalid', async () => {
                jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementationOnce((): boolean => false)

                await expect(
                    getService().confirm(
                        {
                            signature: uuid(),
                            address: bobAddress,
                        },
                        sessionHandler.sessionData,
                    ),
                ).rejects.toThrow(BadRequestException)
            })
        })
    })

    describe('adding web3 account to email&web3 account', async () => {
        let sessionHandler: SessionHandler
        const password = uuid()
        beforeEach(async () => {
            sessionHandler = await createUserSessionHandler(app.get(), 'bob@example.com', 'bob', password)
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementationOnce((): boolean => true)
            await getService().start({address: bobAddress, password}, sessionHandler.sessionData)
            await getService().confirm(
                {
                    signature: uuid(),
                    address: bobAddress,
                },
                sessionHandler.sessionData,
            )
        })

        describe('start', async () => {
            it('should return uuid', async () => {
                const signMessageResponse = await getService().start({address: charlieAddress, password}, sessionHandler.sessionData)
                expect(signMessageResponse.signMessage).toBeDefined()
                expect(validate(signMessageResponse.signMessage)).toBe(true)
            })

            it('should require password', async () => {
                await expect(getService().start({address: charlieAddress}, sessionHandler.sessionData))
                    .rejects
                    .toThrow(BadRequestException)
            })

            it('should allow invalid address', async () => {
                await expect(await getService().start({address: uuid(), password}, sessionHandler.sessionData)).resolves
            })
        })

        describe('confirm', () => {
            beforeEach(async () => {
                await getService().start({address: charlieAddress, password}, sessionHandler.sessionData)
            })

            it('should associate account and NOT make primary', async () => {
                jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementationOnce((): boolean => true)

                await getService().confirm(
                    {
                        signature: uuid(),
                        address: charlieAddress,
                    },
                    sessionHandler.sessionData,
                )

                const actualUser = await getUsersService().findOne(sessionHandler.sessionData.user.id)
                expect(actualUser.blockchainAddresses!.length).toBe(2)
                const addedBlockchainAddress = actualUser.blockchainAddresses?.find((address) => address.address === charlieAddress)
                expect(addedBlockchainAddress).toBeDefined()
                expect(addedBlockchainAddress!.isPrimary).toBe(false)
            })
            it('throws bad request when signature is invalid', async () => {
                jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementationOnce((): boolean => false)

                await expect(
                    getService().confirm(
                        {
                            signature: uuid(),
                            address: charlieAddress,
                        },
                        sessionHandler.sessionData,
                    ),
                ).rejects.toThrow(BadRequestException)
            })
        })
    })
})
