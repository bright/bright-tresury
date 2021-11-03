import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { beforeSetupFullApp } from '../utils/spec.helpers'
import { AppEventReceiverEntity } from './entities/app-event-receiver.entity'
import { AppEventData, AppEventType } from './entities/app-event-type'
import { AppEventEntity } from './entities/app-event.entity'

export function createAndSaveAppEvent(userIds: string[], customData?: AppEventData): Promise<AppEventEntity> {
    const appEvent = createAppEvent(userIds, customData)
    const repository = beforeSetupFullApp().get().get<Repository<AppEventEntity>>(getRepositoryToken(AppEventEntity))
    return repository.save(appEvent)
}

export function createAppEvent(userIds: string[], customData?: AppEventData): AppEventEntity {
    const receivers = userIds.map((userId) => createReceiver(userId))

    const data = customData ?? {
        type: AppEventType.NewIdeaComment as const,
        ideaId: uuid(),
        commentId: uuid(),
        ideaOrdinalNumber: 9,
        ideaTitle: 'title',
        commentsUrl: 'http://localhost:3000',
    }

    const repository = beforeSetupFullApp().get().get<Repository<AppEventEntity>>(getRepositoryToken(AppEventEntity))
    return repository.create({ data, receivers })
}

export function createReceiver(userId: string): AppEventReceiverEntity {
    const repository = beforeSetupFullApp()
        .get()
        .get<Repository<AppEventReceiverEntity>>(getRepositoryToken(AppEventReceiverEntity))
    return repository.create({ userId })
}
