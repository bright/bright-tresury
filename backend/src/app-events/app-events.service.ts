import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { getLogger } from '../logging.module'
import { NewIdeaCommentDto } from './app-event-types/idea-comment/new-idea-comment.dto'
import { NewProposalCommentDto } from './app-event-types/proposal-comment/new-proposal-comment.dto'
import { AppEventReceiver } from './entities/app-event-receiver.entity'
import { AppEvent } from './entities/app-event.entity'

const logger = getLogger()

@Injectable()
export class AppEventsService {
    constructor(
        @InjectRepository(AppEvent) private readonly appEventRepository: Repository<AppEvent>,
        @InjectRepository(AppEventReceiver) private readonly appEventReceiverRepository: Repository<AppEventReceiver>,
    ) {}

    async create(data: NewIdeaCommentDto | NewProposalCommentDto, userIds: string[]): Promise<AppEvent> {
        logger.info('Creating new event...', data, userIds)
        const receivers = userIds.map((userId) => this.appEventReceiverRepository.create({ userId }))

        const appEvent = this.appEventRepository.create({ data, receivers })
        const savedAppEvent = await this.appEventRepository.save(appEvent)

        logger.info('New event created', savedAppEvent)
        return savedAppEvent
    }
}
