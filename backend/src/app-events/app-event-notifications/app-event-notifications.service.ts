import { Injectable } from '@nestjs/common'
import { getLogger } from '../../logging.module'
import { AppEvent } from '../entities/app-event.entity'
import { EmailNotificationsService } from './email-notifications/email-notifications.service'

const logger = getLogger()

@Injectable()
export class AppEventNotificationsService {
    constructor(private readonly emailNotificationsService: EmailNotificationsService) {}

    async notify(appEvent: AppEvent): Promise<void> {
        logger.info('Sending notifications for app event: ', appEvent)
        try {
            await this.emailNotificationsService.send(appEvent)
        } catch (error) {
            logger.error(error)
        }
    }
}
