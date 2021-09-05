import { HttpStatus } from '@nestjs/common'
import { beforeSetupFullApp, cleanDatabase, request, NETWORKS } from '../../utils/spec.helpers'
const { POLKADOT } = NETWORKS
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { mockedBlockchainService } from '../spec.helpers'

describe('Proposal comments', () => {
    const app = beforeSetupFullApp()
    let sessionHandler: SessionHandler

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
    it(`GET comments response should have ${HttpStatus.OK} status code`, async () => {
        return request(app()).get(`/api/v1/proposals/0/comments?network=${POLKADOT}`).expect(HttpStatus.OK)
    })

    it(`GET comments response should have ${HttpStatus.OK} status code for not existing proposal but an empty array response body`, async () => {
        const { body } = await request(app())
            .get(`/api/v1/proposals/0/comments?network=${POLKADOT}`)
            .expect(HttpStatus.OK)
        expect(Array.isArray(body)).toBe(true)
        expect(body).toHaveLength(0)
    })

    it(`POST response should have ${HttpStatus.CREATED} status code`, async () => {
        return sessionHandler.authorizeRequest(
            request(app())
                .post(`/api/v1/proposals/0/comments`)
                .send({ content: 'This is a comment', network: POLKADOT })
                .expect(HttpStatus.CREATED),
        )
    })

    it(`POST response should have ${HttpStatus.FORBIDDEN} status code for not signed in user`, async () => {
        return request(app())
            .post(`/api/v1/proposals/0/comments`)
            .send({ content: 'This is a comment', network: POLKADOT })
            .expect(HttpStatus.FORBIDDEN)
    })

    it(`GET comments request should return new comment after creating one`, async () => {
        await sessionHandler.authorizeRequest(
            request(app())
                .post(`/api/v1/proposals/0/comments`)
                .send({ content: 'This is a comment', network: POLKADOT })
                .expect(HttpStatus.CREATED),
        )

        const { body } = await request(app()).get(`/api/v1/proposals/0/comments?network=${POLKADOT}`)
        expect(Array.isArray(body)).toBe(true)
        expect(body).toHaveLength(1)

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

    it(`PATCH comment request should edit the comment`, async () => {
        await sessionHandler.authorizeRequest(
            request(app())
                .post(`/api/v1/proposals/0/comments`)
                .send({ content: 'This is a comment', network: POLKADOT })
                .expect(HttpStatus.CREATED),
        )

        const { body: commentsAfterCreate } = await request(app()).get(
            `/api/v1/proposals/0/comments?network=${POLKADOT}`,
        )
        expect(Array.isArray(commentsAfterCreate)).toBe(true)
        expect(commentsAfterCreate).toHaveLength(1)

        await sessionHandler.authorizeRequest(
            request(app())
                .patch(`/api/v1/proposals/0/comments/${commentsAfterCreate[0].id}`)
                .send({ content: 'Edited', network: POLKADOT })
                .expect(HttpStatus.OK),
        )

        const { body: commentsAfterUpdate } = await request(app()).get(
            `/api/v1/proposals/0/comments?network=${POLKADOT}`,
        )
        expect(Array.isArray(commentsAfterUpdate)).toBe(true)
        expect(commentsAfterUpdate).toHaveLength(1)

        expect(commentsAfterUpdate[0].content).toBe('Edited')
    })

    it(`DELETE comment request should delete the comment`, async () => {
        await sessionHandler.authorizeRequest(
            request(app())
                .post(`/api/v1/proposals/0/comments`)
                .send({ content: 'This is a comment', network: POLKADOT })
                .expect(HttpStatus.CREATED),
        )

        const { body: commentsAfterCreate } = await request(app()).get(
            `/api/v1/proposals/0/comments?network=${POLKADOT}`,
        )
        expect(Array.isArray(commentsAfterCreate)).toBe(true)
        expect(commentsAfterCreate).toHaveLength(1)

        const comment = commentsAfterCreate[0]
        await sessionHandler.authorizeRequest(
            request(app()).delete(`/api/v1/proposals/0/comments/${comment.id}`).expect(HttpStatus.OK),
        )

        const { body: commentsAfterDelete } = await request(app()).get(
            `/api/v1/proposals/0/comments?network=${POLKADOT}`,
        )
        expect(Array.isArray(commentsAfterDelete)).toBe(true)
        expect(commentsAfterDelete).toHaveLength(0)
    })

    it(`DELETE comment response should have ${HttpStatus.FORBIDDEN} status code for not signed in user`, async () => {
        return request(app())
            .delete(`/api/v1/proposals/0/comments/00000000-0000-0000-0000-000000000000`)
            .expect(HttpStatus.FORBIDDEN)
    })

    it(`DELETE comment response should have ${HttpStatus.NOT_FOUND} status code when deleting comment but its assign to different proposal`, async () => {
        await sessionHandler.authorizeRequest(
            request(app())
                .post(`/api/v1/proposals/0/comments`)
                .send({ content: 'This is a comment', network: POLKADOT })
                .expect(HttpStatus.CREATED),
        )

        const { body: commentsAfterCreate } = await request(app()).get(
            `/api/v1/proposals/0/comments?network=${POLKADOT}`,
        )

        return sessionHandler.authorizeRequest(
            request(app())
                .delete(`/api/v1/comments/10000000/comments/${commentsAfterCreate[0].id}`)
                .expect(HttpStatus.NOT_FOUND),
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
