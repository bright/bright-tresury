import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { getLogger } from '../logging.module'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { PaginatedResponseDto } from '../utils/pagination/paginated.response.dto'
import { isNil, Nil } from '../utils/types'
import { AppEventReceiverEntity } from './entities/app-event-receiver.entity'
import { AppEventData, AppEventType } from './entities/app-event-type'
import { AppEventEntity } from './entities/app-event.entity'

const logger = getLogger()

export interface AppEventsQuery {
    userId: string
    isRead?: Nil<boolean>
    appEventType?: Nil<AppEventType[]>
    ideaId?: Nil<string>
    proposalIndex?: Nil<number>
    networkId?: Nil<string>
}

@Injectable()
export class AppEventsService {
    constructor(
        @InjectRepository(AppEventEntity) private readonly appEventRepository: Repository<AppEventEntity>,
        @InjectRepository(AppEventReceiverEntity)
        private readonly appEventReceiverRepository: Repository<AppEventReceiverEntity>,
    ) {}

    async findAll(
        queryParams: AppEventsQuery,
        paginated?: PaginatedParams,
    ): Promise<{ items: AppEventEntity[]; total: number }> {
        const query = this.buildFindAllQuery(queryParams)
        const response = await PaginatedResponseDto.fromQuery(query, paginated)
        return response
    }

    buildFindAllQuery({ userId, isRead, appEventType, ideaId, proposalIndex, networkId }: AppEventsQuery) {
        let query = this.appEventRepository
            .createQueryBuilder('app_events')
            .innerJoinAndSelect('app_events.receivers', 'receivers')
            .where('receivers.userId = :userId', { userId })
            .orderBy('app_events."createdAt"', 'DESC')

        if (!isNil(isRead)) {
            query = query.andWhere('receivers.isRead = :isRead', { isRead })
        }

        if (!isNil(appEventType)) {
            query = query.andWhere("app_events.data->>'type' in (:...appEventType)", { appEventType })
        }

        if (!isNil(ideaId)) {
            query = query.andWhere("app_events.data->>'ideaId' = :ideaId", { ideaId })
        }

        if (!isNil(proposalIndex)) {
            query = query.andWhere("app_events.data->>'proposalBlockchainId' = :proposalIndex", { proposalIndex })
        }

        if (!isNil(networkId)) {
            query = query.andWhere("app_events.data->>'networkId' = :networkId", { networkId })
        }

        return query
    }

    async create(data: AppEventData, userIds: string[]): Promise<AppEventEntity> {
        logger.info('Creating new event...', data, userIds)
        const receivers = userIds.map((userId) => this.appEventReceiverRepository.create({ userId }))

        const appEvent = this.appEventRepository.create({ data, receivers })
        const savedAppEvent = await this.appEventRepository.save(appEvent)

        logger.info('New event created', savedAppEvent)
        return savedAppEvent
    }

    async markAsRead(userId: string, appEventIds: string[]): Promise<void> {
        const receivers = await this.appEventReceiverRepository.find({ appEvent: { id: In(appEventIds) }, userId })
        await Promise.all(
            receivers.map((receiver) => {
                return this.appEventReceiverRepository.save({ ...receiver, isRead: true })
            }),
        )
    }
}
