import {v4 as uuid} from 'uuid';
import {beforeSetupFullApp, cleanDatabase} from '../../utils/spec.helpers';
import {SuperTokensService} from "./supertokens.service";
import {UsersService} from "../../users/users.service";
import {cleanAuthorizationDatabase, getAuthUser} from "./supertokens.spec.helpers";

describe(`SuperTokens Service`, () => {

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getUsersService = () => app.get().get(UsersService)

    const email = 'chuck@test.test'
    const password = uuid()

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('sign up', () => {
        it('should save user in the database', async (done) => {
            const superTokensUser = await getService().signUp(email, password)
            const savedSuperTokensUser = await getAuthUser(superTokensUser.id)
            expect(savedSuperTokensUser).toBeDefined()
            expect(savedSuperTokensUser!.id).toBe(superTokensUser.id)
            done()
        })
    })
})
