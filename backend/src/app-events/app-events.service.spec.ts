import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { NewIdeaCommentDto } from './app-event-types/idea-comment/new-idea-comment.dto'
import { createSessionData } from '../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase } from '../utils/spec.helpers'
import { AppEventNotificationsService } from './app-event-notifications/app-event-notifications.service'
import { AppEventsService } from './app-events.service'
import { AppEventType } from './entities/app-event-type'
import { AppEvent } from './entities/app-event.entity'

describe('AppEventsService', () => {
    const app = beforeSetupFullApp()

    const service = beforeAllSetup(() => app().get<AppEventsService>(AppEventsService))
    const repository = beforeAllSetup(() => app().get<Repository<AppEvent>>(getRepositoryToken(AppEvent)))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('create', () => {
        const newIdeaCommentEventData: NewIdeaCommentDto = {
            type: AppEventType.NewIdeaComment as const,
            ideaId: uuid(),
            commentId: uuid(),
            ideaOrdinalNumber: 9,
            ideaTitle: 'title',
            commentsUrl: 'http://localhost3000',
        }

        it('should save event entity', async () => {
            const { user } = await createSessionData({ email: 'agnieszka.olszewska@brightinventions.pl' })

            const entity = await service().create(newIdeaCommentEventData, [user.id])

            const savedEntity = (await repository().findOne(entity.id, { relations: ['receivers'] }))!
            expect(savedEntity.data).toEqual(newIdeaCommentEventData)
            expect(savedEntity.receivers).toHaveLength(1)
            const receiver = savedEntity.receivers![0]
            expect(receiver.isRead).toBe(false)
            expect(receiver.userId).toBe(user.id)
        })

        it('should return event entity with receivers', async () => {
            const { user } = await createSessionData({ email: 'agnieszka.olszewska@brightinventions.pl' })

            const entity = await service().create(newIdeaCommentEventData, [user.id])

            expect(entity.data).toEqual(newIdeaCommentEventData)
            expect(entity.receivers).toHaveLength(1)
            const receiver = entity.receivers![0]
            expect(receiver.isRead).toBe(false)
            expect(receiver.userId).toBe(user.id)
        })

        it('should call notify function', async () => {
            const { user } = await createSessionData({ email: 'agnieszka.olszewska@brightinventions.pl' })

            const spy = jest.spyOn(app().get<AppEventNotificationsService>(AppEventNotificationsService), 'notify')

            const entity = await service().create(newIdeaCommentEventData, [user.id])

            expect(spy).toHaveBeenCalledWith(expect.objectContaining(entity))
        })
    })
})
