import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { createSessionData } from '../../ideas/spec.helpers'
import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { UserEntity } from '../entities/user.entity'
import { UserSettingsService } from './user-settings.service'

describe(`Users Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get<UserSettingsService>(UserSettingsService)
    const getRepository = () => app.get().get<Repository<UserEntity>>(getRepositoryToken(UserEntity))

    beforeEach(async () => {
        await cleanDatabase()
    })

    describe('update', () => {
        it('should update isEmailNotificationEnabled', async () => {
            const { user } = await createSessionData()

            await getService().update(user.id, { isEmailNotificationEnabled: false })

            const saved = (await getRepository().findOne(user.id))!

            expect(saved).toMatchObject({ isEmailNotificationEnabled: false })
        })

        it('should update username', async () => {
            const { user } = await createSessionData()

            await getService().update(user.id, { username: 'new username' })

            const saved = (await getRepository().findOne(user.id))!

            expect(saved).toMatchObject({ username: 'new username' })
        })

        it('should not update anything when empty dto', async () => {
            const { user } = await createSessionData()

            await getService().update(user.id, {})

            const saved = (await getRepository().findOne(user.id))!

            expect(saved).toMatchObject({
                username: user.username,
                isEmailNotificationEnabled: user.isEmailNotificationEnabled,
            })
        })
    })
})
