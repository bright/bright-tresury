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
    it(`CRUD Requests`, async () => {
        // CREATE
        const { body: createdComment } = await sessionHandler.authorizeRequest(
            request(app())
                .post(`/api/v1/proposals/0/comments`)
                .send({ content: 'This is a comment', network: POLKADOT })
                .expect(HttpStatus.CREATED),
        )

        // READ
        const { body: readComments } = await request(app()).get(`/api/v1/proposals/0/comments?network=${POLKADOT}`)
        expect(Array.isArray(readComments)).toBe(true)
        expect(readComments).toHaveLength(1)

        const [readComment] = readComments
        expect(readComment).toMatchObject(createdComment)
        expect(readComment.content).toBe('This is a comment')
        const { id: userId, username, isEmailPasswordEnabled } = sessionHandler.sessionData.user
        expect(readComment.author).toMatchObject({ userId, username, isEmailPasswordEnabled })

        // PATCH
        await sessionHandler.authorizeRequest(
            request(app())
                .patch(`/api/v1/proposals/0/comments/${createdComment.id}`)
                .send({ content: 'This is a comment edit', network: POLKADOT })
                .expect(HttpStatus.OK),
        )
        const { body: readCommentsAfterPatch } = await request(app()).get(
            `/api/v1/proposals/0/comments?network=${POLKADOT}`,
        )
        expect(Array.isArray(readCommentsAfterPatch)).toBe(true)
        expect(readCommentsAfterPatch).toHaveLength(1)

        const [readCommentAfterPatch] = readCommentsAfterPatch
        expect(readCommentAfterPatch.content).toBe('This is a comment edit')

        // DELETE
        await sessionHandler.authorizeRequest(
            request(app()).delete(`/api/v1/proposals/0/comments/${createdComment.id}`).expect(HttpStatus.OK),
        )

        const { body: readCommentsAfterDelete } = await request(app()).get(
            `/api/v1/proposals/0/comments?network=${POLKADOT}`,
        )
        expect(Array.isArray(readCommentsAfterDelete)).toBe(true)
        expect(readCommentsAfterDelete).toHaveLength(0)
    })
})
