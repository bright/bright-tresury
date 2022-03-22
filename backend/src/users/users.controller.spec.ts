import { HttpStatus } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandlerWithVerifiedEmail,
    createWeb3SessionHandler,
} from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { beforeSetupFullApp, cleanDatabase, request } from '../utils/spec.helpers'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

const baseUrl = '/api/v1/users?display='

describe('UsersController', () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(UsersService)

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('GET', () => {
        it(`should return status code ${HttpStatus.OK}`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            await getService().create({ authId: uuid(), username: 'bob', email: 'bob@example.com' })

            return sessionHandler.authorizeRequest(request(app()).get(`${baseUrl}bob`)).expect(HttpStatus.OK)
        })

        it('should return public data of the user', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const user = await getService().create({ authId: uuid(), username: 'bob', email: 'bob@example.com' })

            const actual = await sessionHandler.authorizeRequest(request(app()).get(`${baseUrl}bob`))

            expect(actual.body).toHaveLength(1)
            expect(actual.body[0]).toStrictEqual({
                userId: user.id,
                username: user.username,
                status: user.status,
            })
        })

        it('should return empty table when no users found', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())

            const actual = await sessionHandler.authorizeRequest(request(app()).get(`${baseUrl}not-existing`))

            expect(actual.body).toHaveLength(0)
        })

        it('should return user for a given username', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const user = await getService().create({ authId: uuid(), username: 'chuck', email: 'chuck@example.com' })

            const actual = await sessionHandler.authorizeRequest(request(app()).get(`${baseUrl}chuck`))

            expect(actual.body).toHaveLength(1)
            expect(actual.body[0].userId).toBe(user.id)
        })

        it('should return user with web3 address for a given web3 address', async () => {
            const sessionHandler = await createWeb3SessionHandler(app())
            const web3address = sessionHandler.sessionData.user.web3Addresses![0].address
            const actual = await sessionHandler.authorizeRequest(request(app()).get(`${baseUrl}${web3address}`))

            expect(actual.body[0]).toMatchObject({
                userId: sessionHandler.sessionData.user.id,
                web3address,
            })
        })
    })
})
