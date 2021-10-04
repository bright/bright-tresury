import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm'
import { getLogger } from '../../logging.module'
import { AppEventNotificationsService } from '../app-event-notifications/app-event-notifications.service'
import { AppEvent } from '../entities/app-event.entity'

const logger = getLogger()

@EventSubscriber()
export class AppEventSubscriber implements EntitySubscriberInterface<AppEvent> {
    constructor(private readonly notificationsService: AppEventNotificationsService, connection: Connection) {
        connection.subscribers.push(this)
    }

    listenTo() {
        return AppEvent
    }

    async afterInsert({ entity }: InsertEvent<AppEvent>) {
        logger.info(`New AppEvent inserted. Sending notifications for the event: `, entity)
        await this.notificationsService.notify(entity)
    }
}
