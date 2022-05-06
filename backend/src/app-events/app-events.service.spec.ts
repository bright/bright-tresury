import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createSessionData } from '../ideas/spec.helpers'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import { AppEventNotificationsService } from './app-event-notifications/app-event-notifications.service'
import { NewIdeaCommentDto } from './app-event-types/idea-comment/new-idea-comment.dto'
import { NewProposalCommentDto } from './app-event-types/proposal-comment/new-proposal-comment.dto'
import { AppEventsService } from './app-events.service'
import { AppEventReceiverEntity } from './entities/app-event-receiver.entity'
import { AppEventType } from './entities/app-event-type'
import { AppEventEntity } from './entities/app-event.entity'
import { createAndSaveAppEvent } from './spec.helpers'
import { NewTipCommentDto } from './app-event-types/tip-comment/new-tip-comment.dto'
import { NewBountyCommentDto } from './app-event-types/bounty-comment/new-bounty-comment.dto'

describe('AppEventsService', () => {
    const app = beforeSetupFullApp()

    const service = beforeAllSetup(() => app().get<AppEventsService>(AppEventsService))
    const repository = beforeAllSetup(() => app().get<Repository<AppEventEntity>>(getRepositoryToken(AppEventEntity)))
    const receiversRepository = beforeAllSetup(() =>
        app().get<Repository<AppEventReceiverEntity>>(getRepositoryToken(AppEventReceiverEntity)),
    )

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    const newIdeaCommentEventData: NewIdeaCommentDto = {
        type: AppEventType.NewIdeaComment,
        ideaId: uuid(),
        commentId: uuid(),
        ideaOrdinalNumber: 9,
        ideaTitle: 'title',
        commentsUrl: 'http://localhost3000',
        networkIds: [NETWORKS.POLKADOT],
        websiteUrl: 'http://localhost:3000',
    }

    const newProposalCommentEventData: NewProposalCommentDto = {
        type: AppEventType.NewProposalComment,
        commentId: uuid(),
        proposalBlockchainId: 0,
        proposalTitle: 'title',
        commentsUrl: 'http://localhost3000',
        networkId: NETWORKS.POLKADOT,
        websiteUrl: 'http://localhost:3000',
    }

    const newBountyCommentEventData: NewBountyCommentDto = {
        type: AppEventType.NewBountyComment,
        commentId: uuid(),
        bountyBlockchainId: 1,
        bountyTitle: 'title',
        commentsUrl: 'http://localhost3000',
        networkId: NETWORKS.POLKADOT,
        websiteUrl: 'http://localhost:3000',
    }

    const newTipCommentEventData: NewTipCommentDto = {
        type: AppEventType.NewTipComment,
        commentId: uuid(),
        tipHash: '0x0',
        tipTitle: 'title',
        commentsUrl: 'http://localhost3000',
        networkId: NETWORKS.POLKADOT,
        websiteUrl: 'http://localhost:3000',
    }

    describe('create', () => {
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
    describe('findAll', () => {
        it('should return items ordered descending by createdAt date', async () => {
            const { user } = await createSessionData()
            const appEvent2 = await createAndSaveAppEvent([user.id])
            const appEvent1 = await createAndSaveAppEvent([user.id], newIdeaCommentEventData)

            const result = await service().findAll({
                userId: user.id,
            })

            expect(result.items).toHaveLength(2)
            const item = result.items[0]
            expect(result.items[0].id).toBe(appEvent1.id)
            expect(result.items[0].data).toStrictEqual(newIdeaCommentEventData)
            expect(result.items[0].receivers![0].isRead).toBe(false)
            expect(result.items[1].id).toBe(appEvent2.id)
        })

        it('should return total count', async () => {
            const { user } = await createSessionData({ email: 'agnieszka.olszewska@brightinventions.pl' })
            await createAndSaveAppEvent([user.id])

            const result = await service().findAll({
                userId: user.id,
            })

            expect(result.total).toBe(1)
        })

        it('should filter by userId', async () => {
            const { user } = await createSessionData({ email: 'user@example.com', username: 'user' })
            const usersAppEvent = await createAndSaveAppEvent([user.id])
            const { user: otherUser } = await createSessionData({
                email: 'otherUser@example.com',
                username: 'otherUser',
            })
            await createAndSaveAppEvent([otherUser.id])

            const result = await service().findAll({
                userId: user.id,
            })

            expect(result.total).toBe(1)
            expect(result.items).toHaveLength(1)
            expect(result.items[0].id).toStrictEqual(usersAppEvent.id)
        })

        it('should filter by isRead property', async () => {
            const { user } = await createSessionData({ email: 'user@example.com', username: 'user' })
            const notReadAppEvent = await createAndSaveAppEvent([user.id])

            const readAppEvent = await createAndSaveAppEvent([user.id])
            await receiversRepository().save(
                receiversRepository().create({ ...readAppEvent.receivers![0], isRead: true }),
            )

            const resultRead = await service().findAll({
                userId: user.id,
                isRead: true,
            })

            expect(resultRead.total).toBe(1)
            expect(resultRead.items).toHaveLength(1)
            expect(resultRead.items[0].id).toStrictEqual(readAppEvent.id)

            const resultNotRead = await service().findAll({
                userId: user.id,
                isRead: false,
            })

            expect(resultNotRead.total).toBe(1)
            expect(resultNotRead.items).toHaveLength(1)
            expect(resultNotRead.items[0].id).toStrictEqual(notReadAppEvent.id)
        })

        it('should filter by app event type', async () => {
            const { user } = await createSessionData({ email: 'user@example.com', username: 'user' })
            const newIdeaCommentEvent1 = await createAndSaveAppEvent([user.id], newIdeaCommentEventData)
            const newIdeaCommentEvent2 = await createAndSaveAppEvent([user.id], newIdeaCommentEventData)
            await createAndSaveAppEvent([user.id], newProposalCommentEventData)
            await createAndSaveAppEvent([user.id], newProposalCommentEventData)

            const result = await service().findAll({
                userId: user.id,
                appEventType: [AppEventType.NewIdeaComment],
            })

            expect(result.total).toBe(2)
            expect(result.items).toHaveLength(2)
            expect(result.items[0].id).toStrictEqual(newIdeaCommentEvent2.id)
            expect(result.items[1].id).toStrictEqual(newIdeaCommentEvent1.id)
        })

        it('should filter by ideaId', async () => {
            const { user } = await createSessionData({ email: 'user@example.com', username: 'user' })
            const newIdeaCommentEvent1 = await createAndSaveAppEvent([user.id], newIdeaCommentEventData)
            const newIdeaCommentEvent2 = await createAndSaveAppEvent([user.id], newIdeaCommentEventData)
            await createAndSaveAppEvent([user.id], { ...newIdeaCommentEventData, ideaId: uuid() })
            await createAndSaveAppEvent([user.id], newProposalCommentEventData)

            const result = await service().findAll({
                userId: user.id,
                appEventType: [AppEventType.NewIdeaComment],
                ideaId: newIdeaCommentEventData.ideaId,
            })

            expect(result.total).toBe(2)
            expect(result.items).toHaveLength(2)
            expect(result.items[0].id).toStrictEqual(newIdeaCommentEvent2.id)
            expect(result.items[1].id).toStrictEqual(newIdeaCommentEvent1.id)
        })

        it('should filter by proposalIndex and networkId', async () => {
            const { user } = await createSessionData({ email: 'user@example.com', username: 'user' })
            const event1 = await createAndSaveAppEvent([user.id], newProposalCommentEventData)
            const event2 = await createAndSaveAppEvent([user.id], newProposalCommentEventData)
            await createAndSaveAppEvent([user.id], { ...newProposalCommentEventData, networkId: NETWORKS.KUSAMA })
            await createAndSaveAppEvent([user.id], { ...newProposalCommentEventData, proposalBlockchainId: 99 })
            await createAndSaveAppEvent([user.id], newIdeaCommentEventData)

            const result = await service().findAll({
                userId: user.id,
                appEventType: [AppEventType.NewProposalComment],
                proposalIndex: newProposalCommentEventData.proposalBlockchainId,
                networkId: newProposalCommentEventData.networkId,
            })

            expect(result.total).toBe(2)
            expect(result.items).toHaveLength(2)
            expect(result.items[0].id).toStrictEqual(event2.id)
            expect(result.items[1].id).toStrictEqual(event1.id)
        })

        it('should return paginated items', async () => {
            const { user } = await createSessionData({ email: 'user@example.com', username: 'user' })

            const appEvents: AppEventEntity[] = []
            for (let i = 0; i < 10; i++) {
                appEvents.push(await createAndSaveAppEvent([user.id], newIdeaCommentEventData))
            }

            const sortedAppEvents = appEvents.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())

            const paginated = new PaginatedParams({ pageNumber: '2', pageSize: '4' })

            const result = await service().findAll(
                {
                    userId: user.id,
                },
                paginated,
            )

            expect(result.total).toBe(10)
            expect(result.items).toHaveLength(4)
            expect(result.items[0].id).toBe(sortedAppEvents[4].id)
            expect(result.items[1].id).toBe(sortedAppEvents[5].id)
            expect(result.items[2].id).toBe(sortedAppEvents[6].id)
            expect(result.items[3].id).toBe(sortedAppEvents[7].id)
        })

        it('should filter by bountyIndex and networkId', async () => {
            const { user } = await createSessionData({ email: 'user@example.com', username: 'user' })
            const event1 = await createAndSaveAppEvent([user.id], newBountyCommentEventData)
            const event2 = await createAndSaveAppEvent([user.id], newBountyCommentEventData)
            await createAndSaveAppEvent([user.id], { ...newBountyCommentEventData, networkId: NETWORKS.KUSAMA })
            await createAndSaveAppEvent([user.id], { ...newBountyCommentEventData, bountyBlockchainId: 2 })
            await createAndSaveAppEvent([user.id], newIdeaCommentEventData)

            const result = await service().findAll({
                userId: user.id,
                appEventType: [AppEventType.NewBountyComment],
                bountyIndex: newBountyCommentEventData.bountyBlockchainId,
                networkId: newBountyCommentEventData.networkId,
            })

            expect(result.total).toBe(2)
            expect(result.items).toHaveLength(2)
            expect(result.items[0].id).toStrictEqual(event2.id)
            expect(result.items[1].id).toStrictEqual(event1.id)
        })

        it('should filter by tipHash and networkId', async () => {
            const { user } = await createSessionData({ email: 'user@example.com', username: 'user' })
            const event1 = await createAndSaveAppEvent([user.id], newTipCommentEventData)
            const event2 = await createAndSaveAppEvent([user.id], newTipCommentEventData)
            await createAndSaveAppEvent([user.id], { ...newTipCommentEventData, networkId: NETWORKS.KUSAMA })
            await createAndSaveAppEvent([user.id], { ...newTipCommentEventData, tipHash: '99' })
            await createAndSaveAppEvent([user.id], newIdeaCommentEventData)

            const result = await service().findAll({
                userId: user.id,
                appEventType: [AppEventType.NewTipComment],
                tipHash: newTipCommentEventData.tipHash,
                networkId: newTipCommentEventData.networkId,
            })

            expect(result.total).toBe(2)
            expect(result.items).toHaveLength(2)
            expect(result.items[0].id).toStrictEqual(event2.id)
            expect(result.items[1].id).toStrictEqual(event1.id)
        })
    })

    describe('markAsRead', () => {
        it('should set isRead to true for provided ids', async () => {
            const { user } = await createSessionData()
            const appEvent2 = await createAndSaveAppEvent([user.id])
            const appEvent1 = await createAndSaveAppEvent([user.id])

            await service().markAsRead(user.id, [appEvent1.id, appEvent2.id])

            const saved = await repository().findByIds([appEvent1.id, appEvent2.id], { relations: ['receivers'] })
            expect(saved[0].receivers![0].isRead).toBe(true)
            expect(saved[1].receivers![0].isRead).toBe(true)
        })

        it('should not set isRead to true for other events', async () => {
            const { user } = await createSessionData()
            const appEvent2 = await createAndSaveAppEvent([user.id])
            const appEvent1 = await createAndSaveAppEvent([user.id])

            await service().markAsRead(user.id, [appEvent1.id])

            const event1 = (await repository().findOne(appEvent1.id, { relations: ['receivers'] }))!
            expect(event1.receivers![0].isRead).toBe(true)

            const event2 = (await repository().findOne(appEvent2.id, { relations: ['receivers'] }))!
            expect(event2.receivers![0].isRead).toBe(false)
        })
    })
})
