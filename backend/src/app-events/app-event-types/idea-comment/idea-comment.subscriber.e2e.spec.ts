import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { IdeaCommentsService } from '../../../ideas/idea-comments/idea-comments.service'
import { IdeasService } from '../../../ideas/ideas.service'
import { createIdea, createSessionData } from '../../../ideas/spec.helpers'
import { beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../../utils/spec.helpers'
import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'
import { NetworkPlanckValue } from '../../../NetworkPlanckValue'

describe('New idea comment app event e2e', () => {
    const app = beforeSetupFullApp()
    const getIdeaCommentsService = () => app.get().get(IdeaCommentsService)
    const getIdeasService = () => app.get().get(IdeasService)

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        jest.clearAllMocks()
    })

    const setUp = async () => {
        const sessionData = await createSessionData({ username: 'usr_1', email: 'usr_1@example.com' })
        const idea = await createIdea(
            { networks: [{ name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue }] },
            sessionData,
            getIdeasService(),
        )
        return { idea, ideaOwner: sessionData.user }
    }

    describe('after IdeaComment insert', () => {
        it('should create NewIdeaComment event for idea owner', async (done) => {
            const { idea } = await setUp()
            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            const createdComment = await getIdeaCommentsService().create(idea.id, user1.user, {
                content: 'This is a comment',
            })

            expect(spy).toHaveBeenCalledWith(
                {
                    type: AppEventType.NewIdeaComment,
                    ideaId: idea.id,
                    commentId: createdComment.comment.id,
                    ideaOrdinalNumber: idea.ordinalNumber,
                    ideaTitle: idea.details.title,
                    commentsUrl: `http://localhost:3000/ideas/${idea.id}/discussion?networkId=${NETWORKS.POLKADOT}`,
                    networkIds: [NETWORKS.POLKADOT],
                    websiteUrl: 'http://localhost:3000',
                },
                [idea.ownerId],
            )
            done()
        })

        it('should create NewIdeaComment event for all idea commenters and idea owner', async (done) => {
            const { idea } = await setUp()

            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            await getIdeaCommentsService().create(idea.id, user1.user, {
                content: 'comment 1',
            })
            await getIdeaCommentsService().create(idea.id, user1.user, {
                content: 'comment 2',
            })

            const user2 = await createSessionData({ username: 'user2', email: 'user2@example.com' })
            await getIdeaCommentsService().create(idea.id, user2.user, {
                content: 'comment 3',
            })

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const user3 = await createSessionData({ username: 'user3', email: 'user3@example.com' })
            await getIdeaCommentsService().create(idea.id, user3.user, {
                content: 'This is a comment',
            })
            expect(spy).toHaveBeenLastCalledWith(
                expect.anything(),
                expect.arrayContaining([idea.ownerId, user1.user.id, user2.user.id]),
            )
            done()
        })

        it('should not create NewIdeaComment event for idea owner when he is commenting', async (done) => {
            const { idea, ideaOwner } = await setUp()
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            await getIdeaCommentsService().create(idea.id, ideaOwner, {
                content: 'This is a comment',
            })
            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([idea.ownerId]))
            done()
        })

        it('should not create NewIdeaComment event for the commenter', async (done) => {
            const { idea } = await setUp()
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            await getIdeaCommentsService().create(idea.id, user1.user, {
                content: 'comment 1',
            })

            const user2 = await createSessionData({ username: 'user2', email: 'user2@example.com' })
            await getIdeaCommentsService().create(idea.id, user2.user, {
                content: 'comment 2',
            })

            await getIdeaCommentsService().create(idea.id, user2.user, {
                content: 'This is a comment',
            })
            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([user2.user.id]))
            done()
        })
    })
})
