import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { UsersService } from '../users.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UserEntity } from '../user.entity'
import { v4 as uuid } from 'uuid'
import { CreateUserDto } from '../dto/create-user.dto'
import { SignInAttemptService } from './sign-in-attempt.service'
import { SignInAttemptEntity } from './sign-in-attempt.entity'
import FakeTimers from '@sinonjs/fake-timers'
import { sign } from 'jsonwebtoken'

describe(`SignInAttemptService`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SignInAttemptService)
    const getUserService = () => app.get().get(UsersService)
    const getRepository = () => app.get().get(getRepositoryToken(SignInAttemptEntity))

    let user: UserEntity

    beforeEach(async () => {
        await cleanDatabase()
        user = await getUserService().create({
            authId: uuid(),
            username: 'Bob',
            email: 'bob@email.com',
        } as CreateUserDto)
    })
    describe('isLockedOut', () => {
        it('should return false when SignInAttemptEntity not found', async () => {
            await expect(getRepository().findOne({where: { user }})).resolves.toBeUndefined()
            await expect(getService().isLockedOut(user)).resolves.toBe(false)
        })
        it('should return true only after 5 wrong attempts', async () => {
            for (let i = 0; i < 4; i++) {
                await getService().updateSignInAttemptCountAfterWrongTry(user)
                await expect(getRepository().findOne({where: { user }})).resolves.toBeDefined()
                await expect(getService().isLockedOut(user)).resolves.toBe(false)
            }
            await getService().updateSignInAttemptCountAfterWrongTry(user)
            await expect(getRepository().findOne({where: { user }})).resolves.toBeDefined()
            await expect(getService().isLockedOut(user)).resolves.toBe(true)
        })
        it('should return true only for 10 minutes', async () =>{
            const clock = FakeTimers.install()
            const signInAttempt = getRepository().create({user, count: 5, attemptedAt: new Date()})
            await getRepository().save(signInAttempt)

            await expect(getService().isLockedOut(user)).resolves.toBe(true)


            clock.tick('00:01') // one second
            await expect(getService().isLockedOut(user)).resolves.toBe(true)
            clock.tick('05:00') // five minutes
            await expect(getService().isLockedOut(user)).resolves.toBe(true)
            clock.tick('05:00') // five minutes (10 minutes 1 seconds after start)
            await expect(getService().isLockedOut(user)).resolves.toBe(false)

            clock.uninstall()
        })
    })
    describe('updateSignInAttemptCountAfterWrongTry', () => {
        it('should not update the count when locked out', async () => {
            const signInAttempt = getRepository().create({user, count: 5, attemptedAt: new Date()})
            await getRepository().save(signInAttempt)
            await expect(getService().isLockedOut(user)).resolves.toBe(true)

            await getService().updateSignInAttemptCountAfterWrongTry(user)

            const signInAttemptAfterCountUpdate = await getRepository().findOne({where: { user }})
            expect(signInAttemptAfterCountUpdate.count).toBe(signInAttempt.count)
            expect(signInAttemptAfterCountUpdate.attemptedAt.getTime()).toBe(signInAttempt.attemptedAt.getTime())
        })
        it('should roll the attempt count after 10 minutes locked out period', async () => {
            const clock = FakeTimers.install()
            const signInAttempt = getRepository().create({user, count: 5, attemptedAt: new Date()})
            await getRepository().save(signInAttempt)
            await expect(getService().isLockedOut(user)).resolves.toBe(true)

            clock.tick('10:01') // one second

            await expect(getService().isLockedOut(user)).resolves.toBe(false)

            const signInAttemptAfter10m = await getRepository().findOne({where: { user }})
            expect(signInAttemptAfter10m.count).toBe(5)

            await getService().updateSignInAttemptCountAfterWrongTry(user)

            const signInAttemptAfterCountUpdate = await getRepository().findOne({where: { user }})
            expect(signInAttemptAfterCountUpdate.count).toBe(1)
            clock.uninstall()
        })
    })

})
