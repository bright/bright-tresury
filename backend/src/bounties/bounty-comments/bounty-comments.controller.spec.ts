import { HttpStatus } from '@nestjs/common'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainBountiesService } from '../../blockchain/blockchain-bounties/blockchain-bounties.service'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../utils/spec.helpers'
import { blockchainBounty0, mockGetBounties } from '../spec.helpers'
import { BountyCommentsService } from './bounty-comments.service'

const getBaseUrl = (blockchainIndex: any, networkId: string, commentId: string = '') =>
    `/api/v1/bounties/${blockchainIndex}/comments/${commentId}?network=${networkId}`

describe('/api/v1/bounties/:blockchainIndex/comments', () => {
    const app = beforeSetupFullApp()
    const bountyCommentsService = beforeAllSetup(() => app().get<BountyCommentsService>(BountyCommentsService))
    const blockchainBountiesService = beforeAllSetup(() =>
        app().get<BlockchainBountiesService>(BlockchainBountiesService),
    )

    const setUp = async () => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        const commentForBounty0 = await bountyCommentsService().create(
            blockchainBounty0.index,
            NETWORKS.POLKADOT,
            { content: 'some content' },
            sessionHandler.sessionData.user,
        )
        return { sessionHandler, commentForBounty0 }
    }

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    beforeAll(() => {
        mockGetBounties(blockchainBountiesService())
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe('GET', () => {
        it(`should return ${HttpStatus.OK}`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(request(app()).get(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT)))
                .expect(HttpStatus.OK)
        })

        it('should return comments with content, author and dates', async () => {
            const { commentForBounty0 } = await setUp()
            const { body } = await request(app()).get(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT))

            expect(body).toHaveLength(1)
            expect(body[0].content).toBe(commentForBounty0.comment.content)
            expect(body[0].author.userId).toBe(commentForBounty0.comment.authorId)
            expect(body[0].createdAt).toBeDefined()
            expect(body[0].updatedAt).toBe(body[0].createdAt)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not number bountyIndex`, async () => {
            return request(app()).get(getBaseUrl('aa', NETWORKS.POLKADOT)).expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no networkId`, async () => {
            return request(app()).get(getBaseUrl(blockchainBounty0.index, '')).expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid networkId`, async () => {
            return request(app()).get(getBaseUrl(blockchainBounty0.index, 'not-valid')).expect(HttpStatus.BAD_REQUEST)
        })
    })

    describe('POST', () => {
        it(`should return ${HttpStatus.CREATED} for valid data`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app()).post(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT)).send({
                        content: 'the content',
                    }),
                )
                .expect(HttpStatus.CREATED)
        })

        it('should return a comment with content, author and dates', async () => {
            const { sessionHandler } = await setUp()
            const { body } = await sessionHandler.authorizeRequest(
                request(app()).post(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT)).send({
                    content: 'the content',
                }),
            )
            expect(body.content).toBe('the content')
            expect(body.author.userId).toBe(sessionHandler.sessionData.user.id)
            expect(body.createdAt).toBeDefined()
            expect(body.updatedAt).toBe(body.createdAt)
        })

        it(`should call create comment method of bounty comments service`, async () => {
            const { sessionHandler } = await setUp()
            const spy = jest.spyOn(bountyCommentsService(), 'create')

            await sessionHandler.authorizeRequest(
                request(app()).post(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT)).send({
                    content: 'the content',
                }),
            )

            expect(spy).toHaveBeenCalledWith(
                blockchainBounty0.index,
                NETWORKS.POLKADOT,
                { content: 'the content' },
                expect.objectContaining({ id: sessionHandler.sessionData.user.id }),
            )
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no comment content`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(request(app()).post(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT)).send({}))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not number bountyIndex`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(request(app()).post(getBaseUrl('aa', NETWORKS.POLKADOT)).send({ content: 'content' }))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no networkId`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app()).post(getBaseUrl(blockchainBounty0.index, '')).send({ content: 'content' }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid networkId`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app()).post(getBaseUrl(blockchainBounty0.index, 'not-valid')).send({ content: 'content' }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            return request(app())
                .post(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT))
                .send({ content: 'content' })
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedUserSessionHandler = await createUserSessionHandler(app())

            return notVerifiedUserSessionHandler
                .authorizeRequest(
                    request(app())
                        .post(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT))
                        .send({ content: 'content' }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('PATCH', () => {
        it(`should return ${HttpStatus.OK} for valid data`, async () => {
            const { sessionHandler, commentForBounty0 } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT, commentForBounty0.comment.id))
                        .send({
                            content: 'the new content',
                        }),
                )
                .expect(HttpStatus.OK)
        })

        it('should return an updated comment with content, author and dates', async () => {
            const { sessionHandler, commentForBounty0 } = await setUp()

            const { body } = await sessionHandler.authorizeRequest(
                request(app())
                    .patch(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT, commentForBounty0.comment.id))
                    .send({
                        content: 'the new content',
                    }),
            )

            expect(body.content).toBe('the new content')
            expect(body.author.userId).toBe(sessionHandler.sessionData.user.id)
            expect(body.createdAt).toBeDefined()
            expect(body.updatedAt).toBeGreaterThan(body.createdAt)
        })

        it(`should call update comment method of bounty comments service`, async () => {
            const { sessionHandler, commentForBounty0 } = await setUp()
            const spy = jest.spyOn(bountyCommentsService(), 'update')

            await sessionHandler.authorizeRequest(
                request(app())
                    .patch(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT, commentForBounty0.comment.id))
                    .send({
                        content: 'the new content',
                    }),
            )

            expect(spy).toHaveBeenCalledWith(
                blockchainBounty0.index,
                NETWORKS.POLKADOT,
                commentForBounty0.comment.id,
                { content: 'the new content' },
                expect.objectContaining({ id: sessionHandler.sessionData.user.id }),
            )
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not number bountyIndex`, async () => {
            const { sessionHandler, commentForBounty0 } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(getBaseUrl('aa', NETWORKS.POLKADOT, commentForBounty0.comment.id))
                        .send({ content: 'content' }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no networkId`, async () => {
            const { sessionHandler, commentForBounty0 } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(getBaseUrl(blockchainBounty0.index, '', commentForBounty0.comment.id))
                        .send({ content: 'content' }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid networkId`, async () => {
            const { sessionHandler, commentForBounty0 } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(getBaseUrl(blockchainBounty0.index, 'not-valid', commentForBounty0.comment.id))
                        .send({ content: 'content' }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const { commentForBounty0 } = await setUp()
            return request(app())
                .patch(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT, commentForBounty0.comment.id))
                .send({ content: 'content' })
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const { commentForBounty0 } = await setUp()
            const notVerifiedUserSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')

            return notVerifiedUserSessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT, commentForBounty0.comment.id))
                        .send({ content: 'content' }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('DELETE', () => {
        it(`should return ${HttpStatus.OK} for valid data`, async () => {
            const { sessionHandler, commentForBounty0 } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app()).delete(
                        getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT, commentForBounty0.comment.id),
                    ),
                )
                .expect(HttpStatus.OK)
        })

        it(`should call delete comment method of bounty comments service`, async () => {
            const { sessionHandler, commentForBounty0 } = await setUp()
            const spy = jest.spyOn(bountyCommentsService(), 'delete')

            await sessionHandler.authorizeRequest(
                request(app()).delete(
                    getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT, commentForBounty0.comment.id),
                ),
            )

            expect(spy).toHaveBeenCalledWith(
                blockchainBounty0.index,
                NETWORKS.POLKADOT,
                commentForBounty0.comment.id,
                expect.objectContaining({ id: sessionHandler.sessionData.user.id }),
            )
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not number bountyIndex`, async () => {
            const { sessionHandler, commentForBounty0 } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app()).delete(getBaseUrl('aa', NETWORKS.POLKADOT, commentForBounty0.comment.id)),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no networkId`, async () => {
            const { sessionHandler, commentForBounty0 } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app()).delete(getBaseUrl(blockchainBounty0.index, '', commentForBounty0.comment.id)),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid networkId`, async () => {
            const { sessionHandler, commentForBounty0 } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app()).delete(
                        getBaseUrl(blockchainBounty0.index, 'not-valid', commentForBounty0.comment.id),
                    ),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const { commentForBounty0 } = await setUp()
            return request(app())
                .delete(getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT, commentForBounty0.comment.id))
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const { commentForBounty0 } = await setUp()
            const notVerifiedUserSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')

            return notVerifiedUserSessionHandler
                .authorizeRequest(
                    request(app()).delete(
                        getBaseUrl(blockchainBounty0.index, NETWORKS.POLKADOT, commentForBounty0.comment.id),
                    ),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
