import { HttpStatus } from '@nestjs/common'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../utils/spec.helpers'
import { mockedBlockchainService } from '../spec.helpers'
import { createProposalMilestone, setUp } from './spec.helpers'
import { v4 as uuid } from 'uuid'
const baseUrl = '/api/v1/proposals'

describe('/api/v1/proposals/:proposalIndex/milestones', () => {
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

    describe('GET', () => {
        it(`should return ${HttpStatus.OK} for the existing proposal`, async () => {
            const { proposal } = await setUp(app())
            return request(app())
                .get(`${baseUrl}/${proposal.blockchainProposalId}/milestones?network=${NETWORKS.POLKADOT}`)
                .expect(HttpStatus.OK)
        })

        it('should return proposal milestones with data', async () => {
            const { proposal } = await setUp(app())
            await createProposalMilestone(
                app(),
                proposal,
                {
                    ordinalNumber: 0,
                },
                {
                    subject: 'subject',
                    dateFrom: new Date(2021, 3, 20),
                    dateTo: new Date(2021, 3, 21),
                    description: 'description',
                },
            )

            const { body } = await request(app()).get(
                `${baseUrl}/${proposal.blockchainProposalId}/milestones?network=${NETWORKS.POLKADOT}`,
            )

            expect(body.length).toBe(1)
            expect(body[0].ordinalNumber).toBe(0)
            expect(body[0].details.subject).toBe('subject')
            expect(body[0].details.dateFrom).toBe('2021-04-20')
            expect(body[0].details.dateTo).toBe('2021-04-21')
            expect(body[0].details.description).toBe('description')
        })

        it('should return empty array for proposal without milestones', async () => {
            const { proposal } = await setUp(app())
            const { body } = await request(app()).get(
                `${baseUrl}/${proposal.blockchainProposalId}/milestones?network=${NETWORKS.POLKADOT}`,
            )

            expect(body.length).toBe(0)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not numeric proposal index`, async () => {
            return request(app())
                .get(`${baseUrl}/aaa/milestones?network=${NETWORKS.POLKADOT}`)
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid network`, async () => {
            return request(app()).get(`${baseUrl}/0/milestones?network=some_network`).expect(HttpStatus.BAD_REQUEST)
        })
    })

    describe('GET /:milestoneId', () => {
        it(`should return ${HttpStatus.OK} for the existing proposal and milestone id`, async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            return request(app())
                .get(`${baseUrl}/${proposal.blockchainProposalId}/milestones/${milestone.id}`)
                .expect(HttpStatus.OK)
        })

        it('should return proposal milestone with data', async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(
                app(),
                proposal,
                {
                    ordinalNumber: 0,
                },
                {
                    subject: 'subject',
                    dateFrom: new Date(2021, 3, 20),
                    dateTo: new Date(2021, 3, 21),
                    description: 'description',
                },
            )

            const { body } = await request(app()).get(
                `${baseUrl}/${proposal.blockchainProposalId}/milestones/${milestone.id}`,
            )

            expect(body.ordinalNumber).toBe(0)
            expect(body.details.subject).toBe('subject')
            expect(body.details.dateFrom).toBe('2021-04-20')
            expect(body.details.dateTo).toBe('2021-04-21')
            expect(body.details.description).toBe('description')
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not numeric proposal index`, async () => {
            return request(app()).get(`${baseUrl}/aaa/milestones/${uuid()}`).expect(HttpStatus.BAD_REQUEST)
        })
    })
})
