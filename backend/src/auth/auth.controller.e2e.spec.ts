import {v4 as uuid} from 'uuid';
import {beforeSetupFullApp, cleanDatabase, request} from "../utils/spec.helpers";
import {SuperTokensService} from "./supertokens/supertokens.service";
import {UsersService} from "../users/users.service";
import {SessionUser} from "./session/session.decorator";
import {
    createBlockchainSessionHandler,
    createSessionHandler,
    createUserSessionHandler
} from "./supertokens/specHelpers/supertokens.session.spec.helper";
import {cleanAuthorizationDatabase, getAuthUser} from "./supertokens/specHelpers/supertokens.database.spec.helper";

describe(`Auth Controller`, () => {

    const baseUrl = '/api/v1'
    const baseAuthUrl = `${baseUrl}/auth`

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getUsersService = () => app.get().get(UsersService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const bobEmail = 'bob@bobby.bob'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    const blockchainSignUpUser = {address: bobAddress, username: bobUsername, token: uuid()}

    const superTokensSignUpUserPassword = uuid()
    const superTokensSignUpUser = {
        formFields: [
            {
                id: 'email',
                value: bobEmail,
            },
            {
                id: 'password',
                value: superTokensSignUpUserPassword,
            },
            {
                id: 'username',
                value: bobUsername,
            }
        ]
    }

    const superTokensSignInUser = {
        formFields: [
            {
                id: 'email',
                value: bobEmail,
            },
            {
                id: 'password',
                value: superTokensSignUpUserPassword,
            }
        ]
    }

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('blockchain sign up', () => {
        it('should save user in both databases', async () => {
            await createBlockchainSessionHandler(app(), blockchainSignUpUser)
            const user = await getUsersService().findOneByUsername(bobUsername)
            const superTokensUser = await getAuthUser(user.authId)

            expect(user).toBeDefined()
            expect(superTokensUser).toBeDefined()
            expect(superTokensUser!.id).toBe(user.authId)
        })
        it('should create session', async () => {
            const sessionHandler = await createBlockchainSessionHandler(app(), blockchainSignUpUser)
            const session = await getService().getSession(
                sessionHandler.getAuthorizedRequest(), {} as any, false
            )

            expect(session).toBeDefined()
        })
    })

    describe('register blockchain token', () => {
        it('should add token to the current session', async () => {
            const sessionHandler = await createBlockchainSessionHandler(app(), blockchainSignUpUser)

            const token = uuid()
            await sessionHandler.authorizeRequest(request(app())
                .post(`${baseAuthUrl}/blockchain/register-token`)
            ).send({token})

            const session = await getService().getSession(
                sessionHandler.getAuthorizedRequest(), {} as any, false
            )
            const sessionData = await session.getSessionData() as SessionUser
            expect(sessionData.blockchainToken).toStrictEqual(token)
        })
    })

    describe('sign up', () => {
        it('should save user in both databases', async () => {
            await createUserSessionHandler(app(), superTokensSignUpUser)
            const user = await getUsersService().findOneByUsername(bobUsername)
            const superTokensUser = await getAuthUser(user.authId)

            expect(user).toBeDefined()
            expect(superTokensUser).toBeDefined()
            expect(superTokensUser!.id).toBe(user.authId)
        })

        it('should create session', async () => {
            const sessionHandler = await createUserSessionHandler(app(), superTokensSignUpUser)
            const session = await getService().getSession(
                sessionHandler.getAuthorizedRequest(), {} as any, false
            )

            expect(session).toBeDefined()
        })
    })

    describe('sign in', () => {
        it('should create session', async () => {
            await createUserSessionHandler(app(), superTokensSignUpUser)

            const res: any = await request(app())
                .post(`${baseUrl}/signin`)
                .send(superTokensSignInUser)
            const signInSessionHandler = createSessionHandler(res)

            const signInSession = await getService().getSession(
                signInSessionHandler.getAuthorizedRequest(), {} as any, false
            )
            expect(signInSession).toBeDefined()
        })
    })

    describe('session data', () => {
        it('should contain user if any authorized request was made', async () => {
            const sessionHandler = await createUserSessionHandler(app(), superTokensSignUpUser)
            await sessionHandler.authorizeRequest(request(app()).get(`/api/health`))
                .send()
            const session = await getService().getSession(
                sessionHandler.getAuthorizedRequest(), {} as any, false
            )
            const sessionData = await session.getSessionData()

            const user = await getUsersService().findOneByUsername(bobUsername)
            expect(sessionData.user.id).toBe(user.id)
            expect(sessionData.user.username).toBe(user.username)
            expect(sessionData.user.email).toBe(user.email)
        })
    })

})
