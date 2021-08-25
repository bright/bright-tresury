import { HttpStatus } from '@nestjs/common'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandler } from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../utils/spec.helpers'
import { mockedBlockchainService, setUpProposalFromIdea } from '../spec.helpers'

const baseUrl = (blockchainProposalId: number, network: string) =>
    `/api/v1/proposals/${blockchainProposalId}/details?network=${network}`

describe(`/api/v1/proposals/:proposalBlockchainId/details`, () => {
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

    describe('PATCH', () => {
        it(`should return ${HttpStatus.OK} for minimal valid data`, async () => {
            const { sessionHandler, proposal } = await setUpProposalFromIdea(app())
            return sessionHandler
                .authorizeRequest(
                    request(app()).patch(baseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT)).send({}),
                )
                .expect(HttpStatus.OK)
        })

        it(`should return updated proposal details for all data`, async () => {
            const { proposal, sessionHandler } = await setUpProposalFromIdea(app())

            const { body } = await sessionHandler.authorizeRequest(
                request(app())
                    .patch(baseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                    .send({
                        title: 'new title',
                        content: 'new content',
                        contact: 'new contact',
                        portfolio: 'new portfolio',
                        field: 'new field',
                        links: ['new link'],
                    }),
            )

            expect(body.title).toBe('new title')
            expect(body.content).toBe('new content')
            expect(body.contact).toBe('new contact')
            expect(body.portfolio).toBe('new portfolio')
            expect(body.field).toBe('new field')
            expect(body.links).toStrictEqual(['new link'])
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if links are not array`, async () => {
            const { proposal, sessionHandler } = await setUpProposalFromIdea(app())

            return sessionHandler
                .authorizeRequest(
                    request(app()).patch(baseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT)).send({
                        links: 'http://some.link.com',
                    }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const { proposal } = await setUpProposalFromIdea(app())

            return request(app())
                .patch(baseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT))
                .send({
                    title: 'newTitle',
                })
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const { proposal } = await setUpProposalFromIdea(app())
            const notVerifiedSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')

            return notVerifiedSessionHandler
                .authorizeRequest(
                    request(app()).patch(baseUrl(proposal.blockchainProposalId, NETWORKS.POLKADOT)).send({
                        title: 'newTitle',
                    }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
