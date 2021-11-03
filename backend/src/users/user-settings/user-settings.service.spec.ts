import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { createSessionData } from '../../ideas/spec.helpers'
import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { UserEntity } from '../user.entity'
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

            expect(saved.isEmailNotificationEnabled).toBe(false)
        })
    })
})
