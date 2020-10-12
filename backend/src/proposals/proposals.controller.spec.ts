import { beforeSetupFullApp, cleanDatabase, request } from '../utils/spec.helpers';
import { Proposal } from './proposal.entity';
import { ProposalsService } from './proposals.service';

const baseUrl = '/api/v1/proposals'

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
        const service = app.get().get(ProposalsService)
        service.save(new Proposal('Test title'))

        const result = await request(app())
            .get(baseUrl)

        expect(result.body).toBeInstanceOf(Array)
        expect(result.body.length).toBe(1)
        expect(result.body[0].title).toBe('Test title')
    })
})