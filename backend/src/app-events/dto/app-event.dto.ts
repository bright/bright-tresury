import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { AppEventReceiver } from '../entities/app-event-receiver.entity'
import { AppEventData } from '../entities/app-event-type'
import { AppEvent } from '../entities/app-event.entity'

export class AppEventDto {
    @ApiProperty({
        description: 'Id of the app event',
    })
    id: string

    @ApiPropertyOptional({
        description: 'Additional data of the event',
    })
    data: AppEventData

    @ApiPropertyOptional({
        description: 'Is the app event read by user',
    })
    isRead: boolean

    constructor(appEvent: AppEvent, receiver?: AppEventReceiver) {
        this.id = appEvent.id
        this.data = appEvent.data
        this.isRead = receiver?.isRead ?? false
    }
}
