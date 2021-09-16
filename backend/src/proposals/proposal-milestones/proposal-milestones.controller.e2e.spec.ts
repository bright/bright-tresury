import { HttpStatus } from '@nestjs/common'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandler } from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../utils/spec.helpers'
import { mockedBlockchainService, proposals } from '../spec.helpers'
import { createProposalMilestone, setUp } from './spec.helpers'
import { v4 as uuid } from 'uuid'

const baseUrl = '/api/v1/proposals'
const getBaseUrl = (blockchainProposalId: number | string, networkId: string, milestoneId: string = '') =>
    `${baseUrl}/${blockchainProposalId}/milestones/${milestoneId}?network=${networkId}`

describe('E2e tests of /api/v1/proposals/:proposalIndex/milestones', () => {
    const app = beforeSetupFullApp()

    beforeAll(() => {
        jest.spyOn(app().get(BlockchainService), 'getProposals').mockImplementation(
            mockedBlockchainService.getProposals,
        )
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    it(`should create two milestones and read all of them`, async () => {
        const { proposal, sessionHandler } = await setUp(app())

        await sessionHandler.authorizeRequest(
            request(app())
                .post(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                .send({ details: { subject: 'Subject1' } }),
        )

        await sessionHandler.authorizeRequest(
            request(app())
                .post(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                .send({ details: { subject: 'Subject2' } }),
        )

        const { body } = await request(app()).get(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))

        expect(body).toHaveLength(2)
        expect(body[0].details.subject).toBe('Subject1')
        expect(body[1].details.subject).toBe('Subject2')
    })

    it(`should create a milestone, update it and read it`, async () => {
        const { proposal, sessionHandler } = await setUp(app())

        const { body: milestone } = await sessionHandler.authorizeRequest(
            request(app())
                .post(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                .send({ details: { subject: 'Subject1' } }),
        )

        await sessionHandler.authorizeRequest(
            request(app())
                .patch(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id))
                .send({
                    details: {
                        subject: 'Other subject',
                        description: 'Some description',
                        dateFrom: '2021-04-20',
                        dateTo: '2021-04-30',
                    },
                }),
        )

        const { body } = await request(app()).get(
            getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id),
        )

        expect(body.details.subject).toBe('Other subject')
        expect(body.details.description).toBe('Some description')
        expect(body.details.dateFrom).toBe('2021-04-20')
        expect(body.details.dateTo).toBe('2021-04-30')
    })

    it(`should create a milestone, delete it and read NotFound`, async () => {
        const { proposal, sessionHandler } = await setUp(app())

        const { body: milestone } = await sessionHandler.authorizeRequest(
            request(app())
                .post(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                .send({ details: { subject: 'Subject1' } }),
        )

        await sessionHandler.authorizeRequest(
            request(app()).delete(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id)),
        )

        await request(app())
            .get(getBaseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT, milestone.id))
            .expect(HttpStatus.NOT_FOUND)
    })
})
