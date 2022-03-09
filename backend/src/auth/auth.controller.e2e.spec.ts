import { v4 as uuid } from 'uuid'
import { beforeSetupFullApp, cleanDatabase, request } from '../utils/spec.helpers'
import { SuperTokensService } from './supertokens/supertokens.service'
import { UsersService } from '../users/users.service'
import {
    createSessionHandler,
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
} from './supertokens/specHelpers/supertokens.session.spec.helper'
import { cleanAuthorizationDatabase, getAuthUser } from './supertokens/specHelpers/supertokens.database.spec.helper'

describe(`Auth Controller`, () => {
    const baseUrl = '/api/v1/auth'

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getUsersService = () => app.get().get(UsersService)

    const bobEmail = 'bob@bobby.bob'
    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    const superTokensSignUpUserPassword = uuid()

    const superTokensSignInUser = {
        formFields: [
            {
                id: 'email',
                value: bobEmail,
            },
            {
                id: 'password',
                value: superTokensSignUpUserPassword,
            },
        ],
    }

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('sign up', () => {
        it('should save user in both databases', async () => {
            await createUserSessionHandler(app(), bobEmail, bobUsername, superTokensSignUpUserPassword)
            const user = await getUsersService().findOneByUsername(bobUsername)
            const superTokensUser = await getAuthUser(user.authId)

            expect(user).toBeDefined()
            expect(superTokensUser).toBeDefined()
            expect(superTokensUser!.id).toBe(user.authId)
        })

        it('should create session', async () => {
            const sessionHandler = await createUserSessionHandler(
                app(),
                bobEmail,
                bobUsername,
                superTokensSignUpUserPassword,
            )
            const session = await getService().getSession(sessionHandler.getAuthorizedRequest(), {} as any)

            expect(session).toBeDefined()
        })
    })

    describe('sign in', () => {
        it('should create session', async () => {
            await createUserSessionHandler(app(), bobEmail, bobUsername, superTokensSignUpUserPassword)

            const res: any = await request(app()).post(`${baseUrl}/signin`).send(superTokensSignInUser)
            const user = await getUsersService().findOneByEmail(bobEmail)
            const signInSessionHandler = createSessionHandler(res, user)

            const signInSession = await getService().getSession(signInSessionHandler.getAuthorizedRequest(), {} as any)
            expect(signInSession).toBeDefined()
        })

        it(`should prevent sign in unregistered user`, async () => {
            const email = 'email@example.com'
            const password = 'password123'

            const response = await request(app())
                .post(`${baseUrl}/signin`)
                .send({
                    formFields: [
                        {
                            id: 'email',
                            value: email,
                        },
                        {
                            id: 'password',
                            value: password,
                        },
                    ],
                })
            expect(response.status).toBe(200)
            expect(response.body.status).toBe('WRONG_CREDENTIALS_ERROR')
        })
    })

    describe('session data', () => {
        it('should contain user if any authorized request was made', async () => {
            const sessionHandler = await createUserSessionHandler(
                app(),
                bobEmail,
                bobUsername,
                superTokensSignUpUserPassword,
            )
            await sessionHandler.authorizeRequest(request(app()).get(`/api/health`)).send()
            const session = await getService().getSession(sessionHandler.getAuthorizedRequest(), {} as any)
            const sessionData = await session?.getSessionData()

            const user = await getUsersService().findOneByUsername(bobUsername)
            expect(sessionData.user.id).toBe(user.id)
            expect(sessionData.user.username).toBe(user.username)
            expect(sessionData.user.email).toBe(user.email)
        })
    })
})
