import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { beforeSetupFullApp } from '../utils/spec.helpers'
import { AppEventReceiver } from './entities/app-event-receiver.entity'
import { AppEventData, AppEventType } from './entities/app-event-type'
import { AppEvent } from './entities/app-event.entity'

export function createAppEvent(userIds: string[], customData?: AppEventData): AppEvent {
    const receivers = userIds.map((userId) => createReceiver(userId))

    const data = customData ?? {
        type: AppEventType.NewIdeaComment as const,
        ideaId: uuid(),
        commentId: uuid(),
        ideaOrdinalNumber: 9,
        ideaTitle: 'title',
        networkId: 'polkadot',
    }

    const repository = beforeSetupFullApp().get().get<Repository<AppEvent>>(getRepositoryToken(AppEvent))
    return repository.create({ data, receivers })
}

export function createReceiver(userId: string): AppEventReceiver {
    const repository = beforeSetupFullApp()
        .get()
        .get<Repository<AppEventReceiver>>(getRepositoryToken(AppEventReceiver))
    return repository.create({ userId })
}
