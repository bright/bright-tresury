import { HttpStatus } from '@nestjs/common'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, request } from '../../utils/spec.helpers'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { v4 as uuid } from 'uuid'
import { Idea } from '../entities/idea.entity'
import { createIdea, createSessionData } from '../spec.helpers'
import { IdeasService } from '../ideas.service'
import { IdeaCommentsService } from './idea-comments.service'

describe('Idea comments', () => {
    const app = beforeSetupFullApp()
    const ideaCommentsService = beforeAllSetup(() => app().get<IdeaCommentsService>(IdeaCommentsService))
    const ideasService = beforeAllSetup(() => app().get<IdeasService>(IdeasService))
    const ZERO_UUID = '00000000-0000-0000-0000-000000000000'
    let sessionHandler: SessionHandler
    let idea: Idea
    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        idea = await createIdea({}, sessionHandler.sessionData, ideasService())
    })

    // GET
    it(`GET comments response should have ${HttpStatus.OK} status code`, async () => {
        return request(app()).get(`/api/v1/ideas/${idea.id}/comments`).expect(HttpStatus.OK)
    })

    it(`GET idea comments response should have ${HttpStatus.OK} status code and empty array for not existing idea`, async () => {
        const { body: comments } = await request(app()).get(`/api/v1/ideas/${ZERO_UUID}/comments`).expect(HttpStatus.OK)
        expect(Array.isArray(comments)).toBe(true)
        expect(comments).toHaveLength(0)
    })

    it(`GET comments request should return new comment after creating one`, async () => {
        const user = sessionHandler.sessionData.user
        await ideaCommentsService().create(idea.id, user, { content: 'This is a comment' })

        const body = (await request(app()).get(`/api/v1/ideas/${idea.id}/comments`)).body
        expect(Array.isArray(body)).toBe(true)
        expect(body).toHaveLength(1)

        const [comment] = body
        expect(comment).toMatchObject({
            author: { userId: user.id, username: user.username, isEmailPasswordEnabled: user.isEmailPasswordEnabled },
            content: 'This is a comment',
            thumbsUp: 0,
            thumbsDown: 0,
        })
        expect(comment.author.web3address).toBeUndefined()
        expect(comment.id).toBeDefined()
        expect(comment.createdAt).toBeDefined()
        expect(comment.createdAt).not.toBeNaN()
    })

    // POST

    it(`POST response should have ${HttpStatus.CREATED} status code`, async () => {
        return sessionHandler.authorizeRequest(
            request(app())
                .post(`/api/v1/ideas/${idea.id}/comments`)
                .send({ content: 'This is a comment' })
                .expect(HttpStatus.CREATED),
        )
    })

    it(`POST response should have ${HttpStatus.BAD_REQUEST} status code for not correct request body`, async () => {
        return request(app())
            .post(`/api/v1/ideas/${idea.id}/comments`)
            .send({ notContent: 'This is a comment' })
            .expect(HttpStatus.FORBIDDEN)
    })

    it(`POST response should have ${HttpStatus.FORBIDDEN} status code for not signed in user`, async () => {
        return request(app())
            .post(`/api/v1/ideas/${idea.id}/comments`)
            .send({ content: 'This is a comment' })
            .expect(HttpStatus.FORBIDDEN)
    })

    it(`POST response should have ${HttpStatus.NOT_FOUND} status code for not existing idea`, async () => {
        return sessionHandler.authorizeRequest(
            request(app())
                .post(`/api/v1/ideas/${ZERO_UUID}/comments`)
                .send({ content: 'This is a comment' })
                .expect(HttpStatus.NOT_FOUND),
        )
    })

    it(`POST request should create new comment`, async () => {
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

    // PATCH

    it(`PATCH comment request should have ${HttpStatus.OK} response code`, async () => {
        const user = sessionHandler.sessionData.user
        const { comment } = await ideaCommentsService().create(idea.id, user, { content: 'This is a comment' })
        return sessionHandler.authorizeRequest(
            request(app())
                .patch(`/api/v1/ideas/${idea.id}/comments/${comment.id}`)
                .send({ content: 'This is comment update' })
                .expect(HttpStatus.OK),
        )
    })

    it(`PATCH comment request should have ${HttpStatus.BAD_REQUEST} response code when updating with bad request body`, async () => {
        const user = sessionHandler.sessionData.user
        const { comment } = await ideaCommentsService().create(idea.id, user, { content: 'This is a comment' })
        return sessionHandler.authorizeRequest(
            request(app())
                .patch(`/api/v1/ideas/${ZERO_UUID}/comments/${comment.id}`)
                .send({ notContent: 'This is comment update' })
                .expect(HttpStatus.BAD_REQUEST),
        )
    })

    it(`PATCH comment request should have ${HttpStatus.NOT_FOUND} response code when updating comment to non existing idea`, async () => {
        const user = sessionHandler.sessionData.user
        const { comment } = await ideaCommentsService().create(idea.id, user, { content: 'This is a comment' })
        return sessionHandler.authorizeRequest(
            request(app())
                .patch(`/api/v1/ideas/${ZERO_UUID}/comments/${comment.id}`)
                .send({ content: 'This is comment update' })
                .expect(HttpStatus.NOT_FOUND),
        )
    })

    it(`PATCH comment request should have ${HttpStatus.NOT_FOUND} response code when updating non existing comment`, async () => {
        const user = sessionHandler.sessionData.user
        await ideaCommentsService().create(idea.id, user, { content: 'This is a comment' })
        return sessionHandler.authorizeRequest(
            request(app())
                .patch(`/api/v1/ideas/${idea.id}/comments/${ZERO_UUID}`)
                .send({ content: 'This is comment update' })
                .expect(HttpStatus.NOT_FOUND),
        )
    })

    it(`PATCH comment request should have ${HttpStatus.FORBIDDEN} response code when updating while not authorized`, async () => {
        const user = sessionHandler.sessionData.user
        const { comment } = await ideaCommentsService().create(idea.id, user, { content: 'This is a comment' })
        return request(app())
            .patch(`/api/v1/ideas/${idea.id}/comments/${comment.id}`)
            .send({ content: 'This is comment update' })
            .expect(HttpStatus.FORBIDDEN)
    })

    it(`PATCH comment request should have ${HttpStatus.FORBIDDEN} response code when updating other user comment`, async () => {
        const otherUser = (await createSessionData({ username: 'user1', email: 'user1@email.com' })).user
        const { comment } = await ideaCommentsService().create(idea.id, otherUser, { content: 'This is a comment' })

        return sessionHandler.authorizeRequest(
            request(app())
                .patch(`/api/v1/ideas/${idea.id}/comments/${comment.id}`)
                .send({ content: 'This is comment update' })
                .expect(HttpStatus.FORBIDDEN),
        )
    })

    // DELETE

    it(`DELETE comment request should have ${HttpStatus.OK} response code`, async () => {
        const user = sessionHandler.sessionData.user
        const { comment } = await ideaCommentsService().create(idea.id, user, { content: 'This is a comment' })
        return sessionHandler.authorizeRequest(
            request(app()).delete(`/api/v1/ideas/${idea.id}/comments/${comment.id}`).expect(HttpStatus.OK),
        )
    })

    it(`DELETE comment request should delete the comment`, async () => {
        const user = sessionHandler.sessionData.user
        const { comment } = await ideaCommentsService().create(idea.id, user, { content: 'This is a comment' })

        await sessionHandler.authorizeRequest(
            request(app()).delete(`/api/v1/ideas/${idea.id}/comments/${comment.id}`).expect(HttpStatus.OK),
        )

        const comments = await ideaCommentsService().findAll(idea.id)
        expect(Array.isArray(comments)).toBe(true)
        expect(comments).toHaveLength(0)
    })

    it(`DELETE comment response should have ${HttpStatus.FORBIDDEN} status code for not authorized user`, async () => {
        const user = sessionHandler.sessionData.user
        const { comment } = await ideaCommentsService().create(idea.id, user, { content: 'This is a comment' })

        return request(app())
            .delete(`/api/v1/ideas/${idea.id}/comments/${comment.id}`)
            .send({ content: 'This is a comment' })
            .expect(HttpStatus.FORBIDDEN)
    })

    it(`DELETE comment response should have ${HttpStatus.FORBIDDEN} status code when deleting other user comment`, async () => {
        const otherUser = (await createSessionData({ username: 'user1', email: 'user1@email.com' })).user
        const { comment } = await ideaCommentsService().create(idea.id, otherUser, { content: 'This is a comment' })
        await sessionHandler.authorizeRequest(
            request(app())
                .delete(`/api/v1/ideas/${idea.id}/comments/${comment.id}`)
                .send({ content: 'This is a comment' })
                .expect(HttpStatus.FORBIDDEN),
        )
    })

    it(`DELETE comment response should have ${HttpStatus.NOT_FOUND} status code when deleting a comment from non existing idea`, async () => {
        const user = sessionHandler.sessionData.user
        const { comment } = await ideaCommentsService().create(idea.id, user, { content: 'This is a comment' })

        await sessionHandler.authorizeRequest(
            request(app())
                .delete(`/api/v1/ideas/${ZERO_UUID}/comments/${comment.id}`)
                .send({ content: 'This is a comment' })
                .expect(HttpStatus.NOT_FOUND),
        )
    })

    it(`DELETE comment response should have ${HttpStatus.NOT_FOUND} status code for not existing idea comment`, async () => {
        const user = sessionHandler.sessionData.user
        await ideaCommentsService().create(idea.id, user, { content: 'This is a comment' })
        return sessionHandler.authorizeRequest(
            request(app())
                .delete(`/api/v1/ideas/${idea.id}/comments/${ZERO_UUID}`)
                .send({ content: 'This is a comment' })
                .expect(HttpStatus.NOT_FOUND),
        )
    })
})
