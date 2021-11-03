import { HttpStatus } from '@nestjs/common'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, request } from '../../utils/spec.helpers'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { IdeaEntity } from '../entities/idea.entity'
import { createIdea } from '../spec.helpers'
import { IdeasService } from '../ideas.service'

describe('Idea comments', () => {
    const app = beforeSetupFullApp()
    const ideasService = beforeAllSetup(() => app().get<IdeasService>(IdeasService))
    let sessionHandler: SessionHandler
    let idea: IdeaEntity
    beforeAll(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        idea = await createIdea({}, sessionHandler.sessionData, ideasService())
    })

    it(`POST to create new comment, PATCH to update the comment, DELETE to remove the comment`, async () => {
        // POST - create new comment
        await sessionHandler.authorizeRequest(
            request(app())
                .post(`/api/v1/ideas/${idea.id}/comments`)
                .send({ content: 'This is a comment' })
                .expect(HttpStatus.CREATED),
        )

        let body

        // GET - validate created comment

        body = (await request(app()).get(`/api/v1/ideas/${idea.id}/comments`)).body
        expect(Array.isArray(body)).toBe(true)
        expect(body).toHaveLength(1)

        const createdComment = body[0]
        const { id: userId, username, isEmailPasswordEnabled } = sessionHandler.sessionData.user
        expect(createdComment).toMatchObject({
            author: { userId, username, isEmailPasswordEnabled },
            content: 'This is a comment',
            thumbsUp: 0,
            thumbsDown: 0,
        })
        expect(createdComment.author.web3address).toBeUndefined()
        expect(createdComment.id).toBeDefined()
        expect(createdComment.createdAt).toBeDefined()
        expect(createdComment.createdAt).not.toBeNaN()

        // PATCH to update the comment

        await sessionHandler.authorizeRequest(
            request(app())
                .patch(`/api/v1/ideas/${idea.id}/comments/${createdComment.id}`)
                .send({ content: 'This is updated comment' })
                .expect(HttpStatus.OK),
        )
        body = (await request(app()).get(`/api/v1/ideas/${idea.id}/comments`)).body
        expect(Array.isArray(body)).toBe(true)
        expect(body).toHaveLength(1)

        const updatedComment = body[0]
        expect(updatedComment).toMatchObject({
            author: { userId, username, isEmailPasswordEnabled },
            content: 'This is updated comment',
            thumbsUp: 0,
            thumbsDown: 0,
        })

        // DELETE to remove the comment

        await sessionHandler.authorizeRequest(
            request(app())
                .delete(`/api/v1/ideas/${idea.id}/comments/${createdComment.id}`)
                .send({ content: 'This is updated comment' })
                .expect(HttpStatus.OK),
        )
        body = (await request(app()).get(`/api/v1/ideas/${idea.id}/comments`)).body
        expect(Array.isArray(body)).toBe(true)
        expect(body).toHaveLength(0)
    })
})
