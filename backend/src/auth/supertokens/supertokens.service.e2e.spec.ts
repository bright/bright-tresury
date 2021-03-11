import {v4 as uuid} from 'uuid';
import {beforeSetupFullApp, cleanDatabase} from '../../utils/spec.helpers';
import {SuperTokensService} from "./supertokens.service";
import {UsersService} from "../../users/users.service";

describe(`SuperTokens Service`, () => {

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getUsersService = () => app.get().get(UsersService)

    const email = 'chuck@test.test'
    const password = uuid()

    beforeEach(async () => {
        await cleanDatabase()
    })

    describe('sign up', async () => {
        it('should save user in the database', async () => {
            const superTokensUser = await getService().signUp(email, password)
            const user = await getUsersService().findOneByAuthId(superTokensUser.id)
            expect(user).toBeDefined()
            expect(user.authId).toBe(superTokensUser.id)
        })
    })
})
