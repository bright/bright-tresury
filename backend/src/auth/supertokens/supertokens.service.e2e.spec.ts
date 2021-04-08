import {v4 as uuid} from 'uuid';
import {beforeSetupFullApp, cleanDatabase} from '../../utils/spec.helpers';
import {SuperTokensService} from "./supertokens.service";
import {cleanAuthorizationDatabase, getAuthUser} from "./specHelpers/supertokens.database.spec.helper";
import {ConflictException} from "@nestjs/common";

describe(`SuperTokens Service`, () => {

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)

    const email = 'chuck@test.test'
    const password = uuid()

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('sign up', () => {
        it('should save user in the database', async () => {
            const superTokensUser = await getService().signUp(email, password)
            const savedSuperTokensUser = await getAuthUser(superTokensUser.id)
            expect(savedSuperTokensUser).toBeDefined()
            expect(savedSuperTokensUser!.id).toBe(superTokensUser.id)
        })
        it('should not save user if email already taken', async () => {
            await getService().signUp(email, password)
            await expect(getService().signUp(email, password))
                .rejects
                .toThrow(ConflictException)
        })
    })
})
