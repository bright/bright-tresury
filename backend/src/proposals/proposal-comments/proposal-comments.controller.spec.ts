import { HttpStatus, NotFoundException } from '@nestjs/common'
import { beforeSetupFullApp, cleanDatabase, request, NETWORKS, beforeAllSetup } from '../../utils/spec.helpers'
const { POLKADOT } = NETWORKS
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { mockedBlockchainService } from '../spec.helpers'
import { ProposalCommentsService } from './proposal-comments.service'
import { v4 as uuid } from 'uuid'

describe('Proposal comments', () => {
    const app = beforeSetupFullApp()
    let sessionHandler: SessionHandler
    const proposalCommentsService = beforeAllSetup(() => app().get<ProposalCommentsService>(ProposalCommentsService))

    beforeAll(() => {
        jest.spyOn(app().get(BlockchainService), 'getProposals').mockImplementation(
            mockedBlockchainService.getProposals,
        )
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
    })

    // GET
    it(`GET proposal comments response should have ${HttpStatus.OK} status code`, async () => {
        return request(app()).get(`/api/v1/proposals/0/comments?network=${POLKADOT}`).expect(HttpStatus.OK)
    })

    it(`GET proposal comments response should have ${HttpStatus.OK} status and empty array response for not existing proposal`, async () => {
        const { body: comments } = await request(app())
            .get(`/api/v1/proposals/1000/comments?network=${POLKADOT}`)
            .expect(HttpStatus.OK)
        expect(Array.isArray(comments)).toBe(true)
        expect(comments).toHaveLength(0)
    })

    it(`GET comments response should have ${HttpStatus.BAD_REQUEST} status code for not existing network`, async () => {
        return request(app()).get(`/api/v1/proposals/0/comments?network=BAD_NETWORK`).expect(HttpStatus.BAD_REQUEST)
    })

    it(`GET proposal comments response should return proposal comment`, async () => {
        const user = sessionHandler.sessionData.user
        await proposalCommentsService().create(0, POLKADOT, user, { content: 'This is a comment' })
        const { body: comments } = await request(app()).get(`/api/v1/proposals/0/comments?network=${POLKADOT}`)
        expect(Array.isArray(comments)).toBe(true)
        expect(comments).toHaveLength(1)

        const [comment] = comments
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
                .post(`/api/v1/proposals/0/comments`)
                .send({ content: 'This is a comment', network: POLKADOT })
                .expect(HttpStatus.CREATED),
        )
    })
    it(`POST request should create a comment`, async () => {
        const user = sessionHandler.sessionData.user
        const content = uuid()
        const { body: createdComment } = await sessionHandler.authorizeRequest(
            request(app()).post(`/api/v1/proposals/0/comments`).send({ content, network: POLKADOT }),
        )

        const { comment } = await proposalCommentsService().findOne(createdComment.id)
        expect(comment.content).toBe(content)
        expect(comment.author).toBeDefined()
        expect(comment.author!.id).toBe(user.id)
        expect(comment.author!.username).toBe(user.username)
        expect(comment.author!.isEmailPasswordEnabled).toBe(user.isEmailPasswordEnabled)
    })

    it(`POST response should have ${HttpStatus.FORBIDDEN} status code for not signed in user`, async () => {
        return request(app())
            .post(`/api/v1/proposals/0/comments`)
            .send({ content: 'This is a comment', network: POLKADOT })
            .expect(HttpStatus.FORBIDDEN)
    })

    it(`POST response should have ${HttpStatus.BAD_REQUEST} status code for not correct request body`, async () => {
        return sessionHandler.authorizeRequest(
            request(app())
                .post(`/api/v1/proposals/0/comments`)
                .send({ notContent: 'This is a comment', network: POLKADOT })
                .expect(HttpStatus.BAD_REQUEST),
        )
    })

    it(`PATCH comment request should edit the comment`, async () => {
        const user = sessionHandler.sessionData.user
        const { comment } = await proposalCommentsService().create(0, POLKADOT, user, {
            content: 'This is a comment',
        })

        await sessionHandler.authorizeRequest(
            request(app())
                .patch(`/api/v1/proposals/0/comments/${comment.id}`)
                .send({ content: 'This is a comment edit', network: POLKADOT })
                .expect(HttpStatus.OK),
        )

        const { comment: proposalCommentAfterPatch } = await proposalCommentsService().findOne(comment.id)
        expect(proposalCommentAfterPatch.content).toBe('This is a comment edit')
    })

    // DELETE
    it(`DELETE comment request should delete the comment`, async () => {
        const user = sessionHandler.sessionData.user
        const { comment } = await proposalCommentsService().create(0, POLKADOT, user, {
            content: 'This is a comment',
        })
        await sessionHandler.authorizeRequest(
            request(app()).delete(`/api/v1/proposals/0/comments/${comment.id}`).expect(HttpStatus.OK),
        )

        return expect(proposalCommentsService().findOne(comment.id)).rejects.toThrow(NotFoundException)
    })

    it(`DELETE comment response should have ${HttpStatus.FORBIDDEN} status code for not signed in user`, async () => {
        return request(app())
            .delete(`/api/v1/proposals/0/comments/00000000-0000-0000-0000-000000000000`)
            .expect(HttpStatus.FORBIDDEN)
    })

    it(`DELETE comment response should have ${HttpStatus.NOT_FOUND} status code when deleting comment but its assign to different proposal`, async () => {
        const user = sessionHandler.sessionData.user
        const { comment } = await proposalCommentsService().create(1, POLKADOT, user, {
            content: 'This is a comment',
        })

        return sessionHandler.authorizeRequest(
            request(app()).delete(`/api/v1/proposals/2/comments/${comment.id}`).expect(HttpStatus.NOT_FOUND),
        )
    })

    it(`DELETE comment response should have ${HttpStatus.NOT_FOUND} status code for not existing proposal comment`, async () => {
        return sessionHandler.authorizeRequest(
            request(app())
                .delete(`/api/v1/proposals/0/comments/00000000-0000-0000-0000-000000000000`)
                .expect(HttpStatus.NOT_FOUND),
        )
    })
})
