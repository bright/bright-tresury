import { HttpStatus } from '@nestjs/common'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, request } from '../../utils/spec.helpers'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { Idea } from '../entities/idea.entity'
import { createIdea } from '../spec.helpers'
import { IdeasService } from '../ideas.service'

describe('Idea comments', () => {
    const app = beforeSetupFullApp()
    const ideasService = beforeAllSetup(() => app().get<IdeasService>(IdeasService))
    let sessionHandler: SessionHandler
    let idea: Idea
    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        idea = await createIdea({}, sessionHandler.sessionData, ideasService())
    })
    it(`GET comments response should have ${HttpStatus.OK} status code`, async () => {
        return request(app()).get(`/api/v1/ideas/${idea.id}/comments`).expect(HttpStatus.OK)
    })

    it(`GET comments response should have ${HttpStatus.NOT_FOUND} status code for not existing idea`, async () => {
        return request(app())
            .get(`/api/v1/ideas/00000000-0000-0000-0000-000000000000/comments`)
            .expect(HttpStatus.NOT_FOUND)
    })

    it(`POST response should have ${HttpStatus.CREATED} status code`, async () => {
        return sessionHandler.authorizeRequest(
            request(app())
                .post(`/api/v1/ideas/${idea.id}/comments`)
                .send({ content: 'This is a comment' })
                .expect(HttpStatus.CREATED),
        )
    })

    it(`POST response should have ${HttpStatus.FORBIDDEN} status code for not signed in user`, async () => {
        return request(app())
            .post(`/api/v1/ideas/${idea.id}/comments`)
            .send({ content: 'This is a comment' })
            .expect(HttpStatus.FORBIDDEN)
    })

    it(`GET comments request should return new comment after creating one`, async () => {
        await sessionHandler.authorizeRequest(
            request(app())
                .post(`/api/v1/ideas/${idea.id}/comments`)
                .send({ content: 'This is a comment' })
                .expect(HttpStatus.CREATED),
        )

        const { body } = await request(app()).get(`/api/v1/ideas/${idea.id}/comments`)
        expect(Array.isArray(body)).toBe(true)
        expect(body.length).toBe(1)

        const comment = body[0]
        const { id: userId, username, isEmailPasswordEnabled } = sessionHandler.sessionData.user
        expect(comment).toMatchObject({
            author: { userId, username, isEmailPasswordEnabled },
            content: 'This is a comment',
            thumbsUp: 0,
            thumbsDown: 0,
        })
        expect(comment.author.web3address).toBeUndefined()
        expect(comment.id).toBeDefined()
        expect(comment.createdAt).toBeDefined()
        expect(comment.createdAt).not.toBeNaN()
    })
})