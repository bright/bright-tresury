import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { UsersService } from '../users.service'
import { getRepositoryToken } from '@nestjs/typeorm'

import { v4 as uuid } from 'uuid'

import { SignInAttemptService } from './sign-in-attempt.service'
import { SignInAttemptEntity } from './sign-in-attempt.entity'
import FakeTimers from '@sinonjs/fake-timers'

describe(`SignInAttemptService`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SignInAttemptService)
    const getUserService = () => app.get().get(UsersService)
    const getRepository = () => app.get().get(getRepositoryToken(SignInAttemptEntity))

    const setUpUser = async ({ authId, username, email }: { authId?: string; username?: string; email?: string }) =>
        getUserService().create({
            authId: authId ?? uuid(),
            username: username ?? 'Bob',
            email: email ?? 'bob@email.com',
        })

    beforeEach(async () => {
        await cleanDatabase()
    })
    describe('isLockedOut', () => {
        it('should return false when SignInAttemptEntity not found', async () => {
            const user = await setUpUser({})
            await expect(getService().isLockedOut(user)).resolves.toBe(false)
        })

        it('should return false after 4 wrong attempts', async () => {
            const user = await setUpUser({})
            for (let i = 0; i < 4; i++) {
                await getService().updateSignInAttemptCountAfterWrongTry(user)
            }
            await expect(getRepository().findOne({ where: { user } })).resolves.toBeDefined()
            await expect(getService().isLockedOut(user)).resolves.toBe(false)
        })

        it('should return true after 5 wrong attempt', async () => {
            const user = await setUpUser({})
            for (let i = 0; i < 5; i++) {
                await getService().updateSignInAttemptCountAfterWrongTry(user)
            }
            await expect(getRepository().findOne({ where: { user } })).resolves.toBeDefined()
            await expect(getService().isLockedOut(user)).resolves.toBe(true)
        })

        it('should return false after 10 minutes', async () => {
            const clock = FakeTimers.install()
            const user = await setUpUser({})
            const signInAttempt = getRepository().create({ user, count: 5, attemptedAt: new Date() })
            await getRepository().save(signInAttempt)

            clock.tick('10:01') // ten minutes

            await expect(getService().isLockedOut(user)).resolves.toBe(false)
            clock.uninstall()
        })

        it('should return true after 9 minutes 59 seconds', async () => {
            const clock = FakeTimers.install()
            const user = await setUpUser({})
            const signInAttempt = getRepository().create({ user, count: 5, attemptedAt: new Date() })
            await getRepository().save(signInAttempt)

            clock.tick('09:59') // almost ten minutes

            await expect(getService().isLockedOut(user)).resolves.toBe(true)
            clock.uninstall()
        })
    })
    describe('updateSignInAttemptCountAfterWrongTry', () => {
        it('should not update the count when locked out', async () => {
            const user = await setUpUser({})
            const signInAttempt = getRepository().create({ user, count: 5, attemptedAt: new Date() })
            await getRepository().save(signInAttempt)

            await getService().updateSignInAttemptCountAfterWrongTry(user)

            const signInAttemptAfterCountUpdate = await getRepository().findOne({ where: { user } })
            expect(signInAttemptAfterCountUpdate.count).toBe(signInAttempt.count)
            expect(signInAttemptAfterCountUpdate.attemptedAt.getTime()).toBe(signInAttempt.attemptedAt.getTime())
        })
        it.skip('should roll the attempt count after 10 minutes locked out period', async () => {
            const clock = FakeTimers.install()
            const user = await setUpUser({})
            const signInAttempt = getRepository().create({ user, count: 5, attemptedAt: new Date() })
            await getRepository().save(signInAttempt)

            clock.tick('10:01') // 10minutes and 1second

            await getService().updateSignInAttemptCountAfterWrongTry(user)

            const signInAttemptAfterCountUpdate = await getRepository().findOne({ where: { user } })

            expect(signInAttemptAfterCountUpdate.count).toBe(5)

            clock.uninstall()
        })
    })
})
