import { ConflictException, INestApplication } from '@nestjs/common'
import { getUserById } from 'supertokens-node/lib/build/recipe/emailpassword'
import { v4 as uuid, validate } from 'uuid'
import { UsersService } from '../../../users/users.service'
import { beforeSetupFullApp, cleanDatabase } from '../../../utils/spec.helpers'
import { cleanAuthorizationDatabase } from '../../supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createWeb3SessionHandler,
    SessionHandler,
} from '../../supertokens/specHelpers/supertokens.session.spec.helper'
import { SignatureValidator } from '../../web3/signMessage/signature.validator'
import { EmailPasswordAssociateService } from './email-password.associate.service'

const createAliceSessionHandler = (app: INestApplication) =>
    createUserSessionHandler(app, 'alice@example.com', 'alice', uuid())

describe(`Auth Email Password Associate Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(EmailPasswordAssociateService)
    const getUsersService = () => app.get().get(UsersService)
    const getSignatureValidator = () => app.get().get(SignatureValidator)

    let sessionHandler: SessionHandler
    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()

        sessionHandler = await createWeb3SessionHandler(app(), bobAddress)
    })

    const password = uuid()
    const details = {
        username: 'bob',
        email: 'bob@example.com',
        password,
    }

    describe('start associate', () => {
        it('should return uuid', async () => {
            const signMessageResponse = await getService().start({
                address: bobAddress,
                details,
            })

            expect(signMessageResponse.signMessage).toBeDefined()
            expect(validate(signMessageResponse.signMessage)).toBeTruthy()
        })

        it('should return conflict exception if email already exists', async () => {
            const {
                sessionData: { user: aliceUser },
            } = await createAliceSessionHandler(app())

            await expect(
                getService().start({
                    address: bobAddress,
                    details: {
                        ...details,
                        email: aliceUser.email,
                    },
                }),
            ).rejects.toThrow(ConflictException)
        })

        it('should return conflict exception if username already exists', async () => {
            const {
                sessionData: { user: aliceUser },
            } = await createAliceSessionHandler(app())

            await expect(
                getService().start({
                    address: bobAddress,
                    details: {
                        ...details,
                        username: aliceUser.username,
                    },
                }),
            ).rejects.toThrow(ConflictException)
        })
    })

    describe('confirm associate', () => {
        beforeEach(async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)
            await getService().start({ address: bobAddress, details })
        })

        it('should update account details in users table', async () => {
            await getService().confirm(
                {
                    signature: uuid(),
                    address: bobAddress,
                    details,
                },
                sessionHandler.sessionData,
            )

            const updatedUser = await getUsersService().findOne(sessionHandler.sessionData.user.id)
            expect(updatedUser).toBeDefined()
            expect(updatedUser.username).toBe('bob')
            expect(updatedUser.email).toBe('bob@example.com')
        })

        it.only('should update account details in auth database', async () => {
            await getService().confirm(
                {
                    signature: uuid(),
                    address: bobAddress,
                    details,
                },
                sessionHandler.sessionData,
            )

            const actualUser = await getUserById(sessionHandler.sessionData.user.authId)

            expect(actualUser).toBeDefined()
            expect(actualUser!.email).toBe('bob@example.com')
        })

        it('should return conflict exception if email already exists', async () => {
            const {
                sessionData: { user: aliceUser },
            } = await createAliceSessionHandler(app())

            await expect(
                getService().confirm(
                    {
                        signature: uuid(),
                        address: bobAddress,
                        details: {
                            username: 'bob',
                            email: aliceUser.email,
                            password,
                        },
                    },
                    sessionHandler.sessionData,
                ),
            ).rejects.toThrow(ConflictException)
        })

        it('should return conflict exception if username already exists', async () => {
            const {
                sessionData: { user: aliceUser },
            } = await createAliceSessionHandler(app())

            await expect(
                getService().confirm(
                    {
                        signature: uuid(),
                        address: bobAddress,
                        details: {
                            username: aliceUser.username,
                            email: 'bob@example.com',
                            password,
                        },
                    },
                    sessionHandler.sessionData,
                ),
            ).rejects.toThrow(ConflictException)
        })
    })
})
