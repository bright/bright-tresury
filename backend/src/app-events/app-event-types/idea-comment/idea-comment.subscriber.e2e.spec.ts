import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { DiscussionsService } from '../../../discussions/discussions.service'
import { IdeaDiscussionDto } from '../../../discussions/dto/discussion-category/idea-discussion.dto'
import { DiscussionCategory } from '../../../discussions/entites/discussion-category'
import { IdeasService } from '../../../ideas/ideas.service'
import { createIdea, createSessionData } from '../../../ideas/spec.helpers'
import { UserEntity } from '../../../users/entities/user.entity'
import { beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../../utils/spec.helpers'
import { NetworkPlanckValue } from '../../../utils/types'
import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'
import { CommentsService } from '../../../discussions/comments.service'

describe('New idea comment app event e2e', () => {
    const app = beforeSetupFullApp()
    const getDiscussionsService = () => app.get().get(DiscussionsService)
    const getIdeasService = () => app.get().get(IdeasService)
    const getCommentsService = () => app.get().get(CommentsService)

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

    const createIdeaComment = (ideaId: string, user: UserEntity, content: string = 'This is a comment') =>
        getDiscussionsService().addComment(
            {
                content,
                discussionDto: { category: DiscussionCategory.Idea, entityId: ideaId } as IdeaDiscussionDto,
            },
            user,
        )

    describe('after IdeaComment insert', () => {
        it('should create NewIdeaComment event for idea owner', async (done) => {
            const { idea } = await setUp()
            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            const createdComment = await createIdeaComment(idea.id, user1.user)

            expect(spy).toHaveBeenCalledWith(
                {
                    type: AppEventType.NewIdeaComment,
                    ideaId: idea.id,
                    commentId: createdComment.id,
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
            await createIdeaComment(idea.id, user1.user)
            await createIdeaComment(idea.id, user1.user)

            const user2 = await createSessionData({ username: 'user2', email: 'user2@example.com' })
            await createIdeaComment(idea.id, user2.user)

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const user3 = await createSessionData({ username: 'user3', email: 'user3@example.com' })
            await createIdeaComment(idea.id, user3.user)

            expect(spy).toHaveBeenLastCalledWith(
                expect.anything(),
                expect.arrayContaining([idea.ownerId, user1.user.id, user2.user.id]),
            )
            done()
        })

        it('should create NewIdeaComment event for tagged users', async (done) => {
            const { idea, ideaOwner } = await setUp()

            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getDiscussionsService().addComment(
                {
                    content: `This is a comment with tag [@user1](${user1.user.id})`,
                    discussionDto: { category: DiscussionCategory.Idea, entityId: idea.id } as IdeaDiscussionDto,
                },
                ideaOwner,
            )

            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.arrayContaining([]))
            done()
        })

        it('should create TaggedInIdeaComment event for update comment for all tagged users', async () => {
            const { idea, ideaOwner } = await setUp()
            const user2 = await createSessionData({ username: 'user2', email: 'user2@example.com' })
            const comment = await createIdeaComment(idea.id, ideaOwner)

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getCommentsService().update(
                comment.id,
                { content: `This is a comment with tag [@user2](${user2.user.id})` },
                ideaOwner,
            )

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: AppEventType.TaggedInIdeaComment,
                }),
                expect.arrayContaining([user2.user.id]),
            )
        })

        it('should not create NewIdeaComment event for idea owner when he is commenting', async (done) => {
            const { idea, ideaOwner } = await setUp()
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            await createIdeaComment(idea.id, ideaOwner)

            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([idea.ownerId]))
            done()
        })

        it('should not create NewIdeaComment event for the commenter', async (done) => {
            const { idea } = await setUp()
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            await createIdeaComment(idea.id, user1.user)

            const user2 = await createSessionData({ username: 'user2', email: 'user2@example.com' })
            await createIdeaComment(idea.id, user2.user)

            await createIdeaComment(idea.id, user2.user)
            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([user2.user.id]))
            done()
        })
    })
})
