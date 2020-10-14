import { beforeSetupFullApp, cleanDatabase, request } from '../utils/spec.helpers';
import { Proposal } from './proposal.entity';
import { ProposalsService } from './proposals.service';
import { INestApplication } from '@nestjs/common';
import { ProposalNetwork } from './proposalNetwork.entity';

const baseUrl = '/api/v1/proposals'

export function createProposal(proposalName: string, networks?: string[], app: INestApplication = beforeSetupFullApp().get()) {
    const proposal = new Proposal(proposalName)
    return app.get(ProposalsService).save(proposal, networks)
  }
  

describe(`Proposals`, () => {
    const app = beforeSetupFullApp()

    beforeEach(async () => {
        await cleanDatabase()
    })

    it('should return 200', () => {
        return request(app())
            .get(baseUrl)
            .expect(200)
    })

    it('should return proposals', async () => {
        await createProposal('Test title')

        const result = await request(app())
            .get(baseUrl)

        expect(result.body.length).toBe(1)
        expect(result.body[0].title).toBe('Test title')
    })

    it('should return proposals for selected network', async () => {
        await createProposal('Test title1', ['kusama'])
        await createProposal('Test title2', ['kusama', 'polkadot'])
        await createProposal('Test title3', ['polkadot'])

        const result = await request(app())
            .get(`${baseUrl}?network=kusama`)

        expect(result.body.length).toBe(2)
        
        const body = result.body as Array<Proposal>
        const actualProposal1 = body.find(p => p.title === 'Test title1')
        expect(actualProposal1).toBeDefined

        const actualProposal2 = body.find(p => p.title === 'Test title2')
        expect(actualProposal2).toBeDefined
    })
})