import { HttpStatus } from '@nestjs/common'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandler } from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../utils/spec.helpers'
import { mockGetProposalAndGetProposals, proposals } from '../spec.helpers'
import { createProposalMilestone, setUp } from './spec.helpers'
import { v4 as uuid } from 'uuid'

const baseUrl = '/api/v1/proposals'
const getBaseUrl = (blockchainProposalId: number | string, networkId: string, milestoneId: string = '') =>
    `${baseUrl}/${blockchainProposalId}/milestones/${milestoneId}?network=${networkId}`

describe('/api/v1/proposals/:proposalIndex/milestones', () => {
    const app = beforeSetupFullApp()

    beforeAll(() => {
        mockGetProposalAndGetProposals(app().get(BlockchainService))
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('GET', () => {
        it(`should return ${HttpStatus.OK} for the existing proposal`, async () => {
            const { proposal } = await setUp(app())
            return request(app())
                .get(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                .expect(HttpStatus.OK)
        })

        it('should return proposal milestones with data', async () => {
            const { proposal } = await setUp(app())
            await createProposalMilestone(
                app(),
                proposal,
                {},
                {
                    subject: 'subject',
                    dateFrom: new Date(2021, 3, 20),
                    dateTo: new Date(2021, 3, 21),
                    description: 'description',
                },
            )

            const { body } = await request(app()).get(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))

            expect(body.length).toBe(1)
            expect(body[0].details.subject).toBe('subject')
            expect(body[0].details.dateFrom).toBe('2021-04-20')
            expect(body[0].details.dateTo).toBe('2021-04-21')
            expect(body[0].details.description).toBe('description')
            expect(body[0].details.createdAt).toBeDefined()
            expect(body[0].details.updatedAt).toBeDefined()
        })

        it('should return empty array for proposal without milestones', async () => {
            const { proposal } = await setUp(app())
            const { body } = await request(app()).get(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))

            expect(body.length).toBe(0)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not numeric proposal index`, async () => {
            return request(app()).get(getBaseUrl('a', NETWORKS.POLKADOT)).expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid network`, async () => {
            const { proposal } = await setUp(app())
            return request(app())
                .get(getBaseUrl(proposal.blockchainProposalId, 'some_network'))
                .expect(HttpStatus.BAD_REQUEST)
        })
    })

    describe('GET /:milestoneId', () => {
        it(`should return ${HttpStatus.OK} for the existing proposal and milestone id`, async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            return request(app())
                .get(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id))
                .expect(HttpStatus.OK)
        })

        it('should return proposal milestone with data', async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(
                app(),
                proposal,
                {},
                {
                    subject: 'subject',
                    dateFrom: new Date(2021, 3, 20),
                    dateTo: new Date(2021, 3, 21),
                    description: 'description',
                },
            )

            const { body } = await request(app()).get(
                getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id),
            )

            expect(body.details.subject).toBe('subject')
            expect(body.details.dateFrom).toBe('2021-04-20')
            expect(body.details.dateTo).toBe('2021-04-21')
            expect(body.details.description).toBe('description')
            expect(body.details.createdAt).toBeDefined()
            expect(body.details.updatedAt).toBeDefined()
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not numeric proposal index`, async () => {
            return request(app()).get(getBaseUrl('a', NETWORKS.POLKADOT, uuid())).expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid network`, async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            return request(app())
                .get(getBaseUrl(proposal.blockchainProposalId, 'some_network', milestone.id))
                .expect(HttpStatus.BAD_REQUEST)
        })
    })

    describe('POST', () => {
        const details = {
            subject: 'Subject',
        }
        it(`should return ${HttpStatus.CREATED} for minimal valid data`, async () => {
            const { proposal, sessionHandler } = await setUp(app())
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                        .send({ details: { subject: 'Subject' } }),
                )
                .expect(HttpStatus.CREATED)
        })

        it('should return proposal milestone with data for all valid data', async () => {
            const { proposal, sessionHandler } = await setUp(app())
            const { body } = await sessionHandler.authorizeRequest(
                request(app())
                    .post(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                    .send({
                        details: {
                            subject: 'Subject',
                            description: 'Description',
                            dateFrom: '2021-04-20',
                            dateTo: '2021-04-21',
                        },
                    }),
            )

            expect(body.details.subject).toBe('Subject')
            expect(body.details.dateFrom).toBe('2021-04-20')
            expect(body.details.dateTo).toBe('2021-04-21')
            expect(body.details.description).toBe('Description')
            expect(body.details.createdAt).toBeDefined()
            expect(body.details.updatedAt).toBe(body.details.createdAt)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no subject`, async () => {
            const { proposal, sessionHandler } = await setUp(app())
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                        .send({ details: {} }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid dateFrom string`, async () => {
            const { proposal, sessionHandler } = await setUp(app())
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                        .send({
                            details: {
                                ...details,
                                dateFrom: 'not-valid-date',
                            },
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid dateTo string`, async () => {
            const { proposal, sessionHandler } = await setUp(app())
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                        .send({
                            details: {
                                ...details,
                                dateTo: 'not-valid-date',
                            },
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not numeric proposal index`, async () => {
            const { sessionHandler } = await setUp(app())
            return sessionHandler
                .authorizeRequest(
                    request(app()).post(getBaseUrl('a', NETWORKS.POLKADOT)).send({
                        details,
                    }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid network`, async () => {
            const { sessionHandler, proposal } = await setUp(app())
            return sessionHandler
                .authorizeRequest(
                    request(app()).post(getBaseUrl(proposal.blockchainProposalId, 'some_network')).send({
                        details,
                    }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const { proposal } = await setUp(app())
            return request(app())
                .post(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                .send({ details: { subject: 'Subject' } })
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')
            const { proposal } = await setUp(app())

            return notVerifiedSessionHandler
                .authorizeRequest(
                    request(app())
                        .post(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                        .send({ details: { subject: 'Subject' } }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('PATCH /:milestoneId', () => {
        it(`should return ${HttpStatus.OK} for minimal valid data`, async () => {
            const { proposal, sessionHandler } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)

            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id))
                        .send({}),
                )
                .expect(HttpStatus.OK)
        })

        it('should return proposal milestone with data for all valid data', async () => {
            const { proposal, sessionHandler } = await setUp(app())

            const milestone = await createProposalMilestone(
                app(),
                proposal,
                {},
                {
                    subject: 'Subject',
                    description: 'Description',
                    dateFrom: new Date('2021-04-20'),
                    dateTo: new Date('2021-04-21'),
                },
            )

            const { body } = await sessionHandler.authorizeRequest(
                request(app())
                    .patch(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id))
                    .send({
                        details: {
                            subject: 'New Subject',
                            description: 'New Description',
                            dateFrom: '2021-04-30',
                            dateTo: '2021-05-03',
                        },
                    }),
            )

            expect(body.details.subject).toBe('New Subject')
            expect(body.details.dateFrom).toBe('2021-04-30')
            expect(body.details.dateTo).toBe('2021-05-03')
            expect(body.details.description).toBe('New Description')
            expect(body.details.createdAt).toBeDefined()
            expect(new Date(body.details.updatedAt).getTime()).toBeGreaterThan(
                new Date(body.details.createdAt).getTime(),
            )
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid dateFrom string`, async () => {
            const { proposal, sessionHandler } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id))
                        .send({
                            details: { dateFrom: 'not-valid' },
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid dateTo string`, async () => {
            const { proposal, sessionHandler } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id))
                        .send({ details: { dateTo: 'not-valid' } }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not numeric proposal index`, async () => {
            const { sessionHandler, proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            return sessionHandler
                .authorizeRequest(request(app()).patch(getBaseUrl('aaa', NETWORKS.POLKADOT, milestone.id)).send({}))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid network`, async () => {
            const { sessionHandler, proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(getBaseUrl(proposal.blockchainProposalId, milestone.id, 'some_network'))
                        .send({}),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            return request(app())
                .patch(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id))
                .send({})
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)

            return notVerifiedSessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id))
                        .send({}),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('DELETE /:milestoneId', () => {
        it(`should return ${HttpStatus.OK}`, async () => {
            const { proposal, sessionHandler } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)

            return sessionHandler
                .authorizeRequest(
                    request(app()).delete(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id)),
                )
                .expect(HttpStatus.OK)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not numeric proposal index`, async () => {
            const { sessionHandler, proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            return sessionHandler
                .authorizeRequest(request(app()).delete(getBaseUrl('aaa', NETWORKS.POLKADOT, milestone.id)))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid network`, async () => {
            const { sessionHandler, proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            return sessionHandler
                .authorizeRequest(
                    request(app()).delete(getBaseUrl(proposal.blockchainProposalId, milestone.id, 'some_network')),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            return request(app())
                .delete(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id))
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)

            return notVerifiedSessionHandler
                .authorizeRequest(
                    request(app()).delete(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id)),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
