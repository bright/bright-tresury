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

const getBaseUrl = (blockchainIndex: number) => `/api/v1/bounties/${blockchainIndex}/comments`

describe('/api/v1/bounties/:blockchainIndex/comments', () => {
    const app = beforeSetupFullApp()
    const bountyCommentsService = beforeAllSetup(() => app().get<BountyCommentsService>(BountyCommentsService))
    const blockchainBountiesService = beforeAllSetup(() =>
        app().get<BlockchainBountiesService>(BlockchainBountiesService),
    )

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

    describe('POST', () => {
        const setUp = async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return { sessionHandler }
        }

        it(`should return ${HttpStatus.CREATED} for valid data`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app()).post(getBaseUrl(blockchainBounty0.index)).send({
                        content: 'the content',
                        networkId: NETWORKS.POLKADOT,
                    }),
                )
                .expect(HttpStatus.CREATED)
        })

        it('should return a comment with content, author and dates', async () => {
            const { sessionHandler } = await setUp()
            const { body } = await sessionHandler.authorizeRequest(
                request(app()).post(getBaseUrl(blockchainBounty0.index)).send({
                    content: 'the content',
                    networkId: NETWORKS.POLKADOT,
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
                request(app()).post(getBaseUrl(blockchainBounty0.index)).send({
                    content: 'the content',
                    networkId: NETWORKS.POLKADOT,
                }),
            )

            expect(spy).toHaveBeenCalledWith(
                blockchainBounty0.index,
                { content: 'the content', networkId: NETWORKS.POLKADOT },
                expect.objectContaining({ id: sessionHandler.sessionData.user.id }),
            )
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no comment content`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app()).post(getBaseUrl(blockchainBounty0.index)).send({ networkId: NETWORKS.POLKADOT }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no networkId`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(request(app()).post(getBaseUrl(blockchainBounty0.index)).send({ content: 'content' }))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid networkId`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(getBaseUrl(blockchainBounty0.index))
                        .send({ content: 'content', networkId: 'not-valid' }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            return request(app())
                .post(getBaseUrl(blockchainBounty0.index))
                .send({ content: 'content', networkId: NETWORKS.POLKADOT })
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedUserSessionHandler = await createUserSessionHandler(app())

            return notVerifiedUserSessionHandler
                .authorizeRequest(
                    request(app())
                        .post(getBaseUrl(blockchainBounty0.index))
                        .send({ content: 'content', networkId: NETWORKS.POLKADOT }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
