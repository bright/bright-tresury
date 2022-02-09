import { PaginatedParams } from '../../utils/pagination/paginated.param'
import { beforeSetupFullApp, NETWORKS } from '../../utils/spec.helpers'
import { PolkassemblyTreasuryProposalsService } from './polkassembly-treasury-proposals.service'

describe('PolkassemblyTreasuryProposalsService', () => {
    const app = beforeSetupFullApp()
    const getService = () => app().get(PolkassemblyTreasuryProposalsService)

    it('findOne', async () => {
        const proposal = await getService().findOne(72, NETWORKS.POLKADOT)
        expect(proposal).toBeUndefined()
    })
    it('find', async () => {
        const proposals = await getService().find({
            includeIndexes: [72],
            networkId: NETWORKS.POLKADOT,
            paginatedParams: new PaginatedParams({}),
        })
        expect(Array.isArray(proposals)).toBe(true)
        expect(proposals).toHaveLength(0)
    })
})
