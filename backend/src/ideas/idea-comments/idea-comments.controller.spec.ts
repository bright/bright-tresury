import { HttpStatus } from '@nestjs/common'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, request } from '../../utils/spec.helpers'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandlerWithVerifiedEmail } from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { v4 as uuid } from 'uuid'
import { createIdea, createSessionData } from '../spec.helpers'
import { IdeasService } from '../ideas.service'
import { IdeaCommentsService } from './idea-comments.service'

describe('Idea comments', () => {
    const app = beforeSetupFullApp()
    const ideaCommentsService = beforeAllSetup(() => app().get<IdeaCommentsService>(IdeaCommentsService))
    const ideasService = beforeAllSetup(() => app().get<IdeasService>(IdeasService))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    const setUp = async () => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        const idea = await createIdea({}, sessionHandler.sessionData, ideasService())
        const content = { content: 'This is a comment' }
        const user = sessionHandler.sessionData.user
        const createComment = async () => await ideaCommentsService().create(idea.id, user, content)
        return {
            sessionHandler,
            idea,
            content,
            createComment,
        }
    }

    describe('GET', () => {
        it(`comments response should have ${HttpStatus.OK} status code`, async () => {
            const { idea } = await setUp()
            return request(app()).get(`/api/v1/ideas/${idea.id}/comments`).expect(HttpStatus.OK)
        })

        it(`idea comments response should have ${HttpStatus.OK} status code and empty array for not existing idea`, async () => {
            const ideaId = uuid()
            const { body: comments } = await request(app())
                .get(`/api/v1/ideas/${ideaId}/comments`)
                .expect(HttpStatus.OK)
            expect(Array.isArray(comments)).toBe(true)
            expect(comments).toHaveLength(0)
        })

        it(`comments request should return new comment after creating one`, async () => {
            const { idea, sessionHandler, content, createComment } = await setUp()
            const user = sessionHandler.sessionData.user
            await createComment()

            const body = (await request(app()).get(`/api/v1/ideas/${idea.id}/comments`)).body

            const [comment] = body
            expect(comment).toMatchObject({
                author: {
                    userId: user.id,
                    username: user.username,
                    isEmailPasswordEnabled: user.isEmailPasswordEnabled,
                },
                content: content.content,
                thumbsUp: 0,
                thumbsDown: 0,
            })
            expect(comment.author.web3address).toBeUndefined()
            expect(comment.id).toBeDefined()
            expect(comment.createdAt).toBeDefined()
            expect(comment.createdAt).not.toBeNaN()
        })
    })

    describe('POST', () => {
        it(`response should have ${HttpStatus.CREATED} status code`, async () => {
            const { idea, sessionHandler, content } = await setUp()
            return sessionHandler.authorizeRequest(
                request(app()).post(`/api/v1/ideas/${idea.id}/comments`).send(content).expect(HttpStatus.CREATED),
            )
        })

        it(`response should have ${HttpStatus.BAD_REQUEST} status code for not correct request body`, async () => {
            const { idea } = await setUp()
            return request(app())
                .post(`/api/v1/ideas/${idea.id}/comments`)
                .send({ notContent: 'This is a comment' })
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`response should have ${HttpStatus.FORBIDDEN} status code for not signed in user`, async () => {
            const { idea } = await setUp()
            return request(app())
                .post(`/api/v1/ideas/${idea.id}/comments`)
                .send({ content: 'This is a comment' })
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`response should have ${HttpStatus.NOT_FOUND} status code for not existing idea`, async () => {
            const { sessionHandler, content } = await setUp()
            const ideaId = uuid()
            return sessionHandler.authorizeRequest(
                request(app()).post(`/api/v1/ideas/${ideaId}/comments`).send(content).expect(HttpStatus.NOT_FOUND),
            )
        })

        it(`request should create new comment`, async () => {
            const { idea, sessionHandler } = await setUp()
            const user = sessionHandler.sessionData.user
            const content = uuid()

            const response = await sessionHandler.authorizeRequest(
                request(app()).post(`/api/v1/ideas/${idea.id}/comments`).send({ content }),
            )

            const createdComment = response.body

            const { comment } = await ideaCommentsService().findOne(idea.id, createdComment.id)
            expect(comment.content).toBe(content)
            expect(comment.author).toBeDefined()
            expect(comment.author!.id).toBe(user.id)
            expect(comment.author!.username).toBe(user.username)
            expect(comment.author!.isEmailPasswordEnabled).toBe(user.isEmailPasswordEnabled)
        })
    })

    describe('PATCH', () => {
        it(`comment request should have ${HttpStatus.OK} response code`, async () => {
            const { idea, sessionHandler, content, createComment } = await setUp()
            const { comment } = await createComment()
            return sessionHandler.authorizeRequest(
                request(app())
                    .patch(`/api/v1/ideas/${idea.id}/comments/${comment.id}`)
                    .send(content)
                    .expect(HttpStatus.OK),
            )
        })

        it(`comment request should have ${HttpStatus.BAD_REQUEST} response code when updating with bad request body`, async () => {
            const { sessionHandler, createComment } = await setUp()
            const ideaId = uuid()
            const comment = await createComment()
            return sessionHandler.authorizeRequest(
                request(app())
                    .patch(`/api/v1/ideas/${ideaId}/comments/${comment.id}`)
                    .send({ notContent: 'This is comment update' })
                    .expect(HttpStatus.BAD_REQUEST),
            )
        })

        it(`comment request should have ${HttpStatus.NOT_FOUND} response code when updating comment to non existing idea`, async () => {
            const { sessionHandler, content, createComment } = await setUp()
            const ideaId = uuid()
            const comment = await createComment()
            return sessionHandler.authorizeRequest(
                request(app())
                    .patch(`/api/v1/ideas/${ideaId}/comments/${comment.id}`)
                    .send(content)
                    .expect(HttpStatus.NOT_FOUND),
            )
        })

        it(`comment request should have ${HttpStatus.NOT_FOUND} response code when updating non existing comment`, async () => {
            const { idea, sessionHandler, content, createComment } = await setUp()
            const ideaId = uuid()
            await createComment()
            return sessionHandler.authorizeRequest(
                request(app())
                    .patch(`/api/v1/ideas/${idea.id}/comments/${ideaId}`)
                    .send(content)
                    .expect(HttpStatus.NOT_FOUND),
            )
        })

        it(`comment request should have ${HttpStatus.FORBIDDEN} response code when updating while not authorized`, async () => {
            const { idea, content, createComment } = await setUp()
            const comment = await createComment()

            return request(app())
                .patch(`/api/v1/ideas/${idea.id}/comments/${comment.id}`)
                .send(content)
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`comment request should have ${HttpStatus.FORBIDDEN} response code when updating other user comment`, async () => {
            const { idea, sessionHandler, content } = await setUp()
            const otherUser = (await createSessionData({ username: 'user1', email: 'user1@email.com' })).user
            const { comment } = await ideaCommentsService().create(idea.id, otherUser, content)

            return sessionHandler.authorizeRequest(
                request(app())
                    .patch(`/api/v1/ideas/${idea.id}/comments/${comment.id}`)
                    .send(content)
                    .expect(HttpStatus.FORBIDDEN),
            )
        })
    })

    describe('DELETE', () => {
        it(`comment request should have ${HttpStatus.OK} response code`, async () => {
            const { idea, sessionHandler, createComment } = await setUp()
            const { comment } = await createComment()

            return sessionHandler.authorizeRequest(
                request(app()).delete(`/api/v1/ideas/${idea.id}/comments/${comment.id}`).expect(HttpStatus.OK),
            )
        })

        it(`comment request should delete the comment`, async () => {
            const { idea, sessionHandler, createComment } = await setUp()
            const { comment } = await createComment()

            await sessionHandler.authorizeRequest(
                request(app()).delete(`/api/v1/ideas/${idea.id}/comments/${comment.id}`).expect(HttpStatus.OK),
            )

            const comments = await ideaCommentsService().findAll(idea.id)
            expect(Array.isArray(comments)).toBe(true)
            expect(comments).toHaveLength(0)
        })

        it(`comment response should have ${HttpStatus.FORBIDDEN} status code for not authorized user`, async () => {
            const { idea, content, createComment } = await setUp()
            const { comment } = await createComment()

            return request(app())
                .delete(`/api/v1/ideas/${idea.id}/comments/${comment.id}`)
                .send(content)
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`comment response should have ${HttpStatus.FORBIDDEN} status code when deleting other user comment`, async () => {
            const { idea, sessionHandler, content } = await setUp()
            const otherUser = (await createSessionData({ username: 'user1', email: 'user1@email.com' })).user
            const { comment } = await ideaCommentsService().create(idea.id, otherUser, content)
            await sessionHandler.authorizeRequest(
                request(app())
                    .delete(`/api/v1/ideas/${idea.id}/comments/${comment.id}`)
                    .send(content)
                    .expect(HttpStatus.FORBIDDEN),
            )
        })

        it(`comment response should have ${HttpStatus.NOT_FOUND} status code when deleting a comment from non existing idea`, async () => {
            const { sessionHandler, content, createComment } = await setUp()
            const ideaId = uuid()
            const { comment } = await createComment()

            await sessionHandler.authorizeRequest(
                request(app())
                    .delete(`/api/v1/ideas/${ideaId}/comments/${comment.id}`)
                    .send(content)
                    .expect(HttpStatus.NOT_FOUND),
            )
        })

        it(`comment response should have ${HttpStatus.NOT_FOUND} status code for not existing idea comment`, async () => {
            const { idea, sessionHandler, content } = await setUp()
            const user = sessionHandler.sessionData.user
            const ideaId = uuid()
            await ideaCommentsService().create(idea.id, user, content)
            return sessionHandler.authorizeRequest(
                request(app())
                    .delete(`/api/v1/ideas/${idea.id}/comments/${ideaId}`)
                    .send(content)
                    .expect(HttpStatus.NOT_FOUND),
            )
        })
    })
})
