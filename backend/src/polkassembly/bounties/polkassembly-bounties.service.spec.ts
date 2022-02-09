import { PaginatedParams } from '../../utils/pagination/paginated.param'
import { beforeSetupFullApp, NETWORKS } from '../../utils/spec.helpers'
import { PolkassemblyBountiesService } from './polkassembly-bounties.service'

describe('PolkassemblyBountiesService', () => {
    const app = beforeSetupFullApp()
    const getService = () => app().get(PolkassemblyBountiesService)

    it('findOne', async () => {
        const bounty = await getService().findOne(72, NETWORKS.POLKADOT)
        expect(bounty).toBeUndefined()
    })
    it('find', async () => {
        const bounties = await getService().find({
            includeIndexes: [72],
            networkId: NETWORKS.POLKADOT,
            paginatedParams: new PaginatedParams({}),
        })
        expect(Array.isArray(bounties)).toBe(true)
        expect(bounties).toHaveLength(0)
    })
})
