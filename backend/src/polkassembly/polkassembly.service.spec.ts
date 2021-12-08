import { beforeSetupFullApp, NETWORKS } from '../utils/spec.helpers'
import { PolkassemblyService } from './polkassembly.service'
import { PaginatedParams } from '../utils/pagination/paginated.param'


describe('polkassembly service', () => {
    const app = beforeSetupFullApp()
    const getService = () => app().get(PolkassemblyService)
    describe('proposals', () => {
        it('findOne', async () => {
            const proposal = await getService().getProposal(72, NETWORKS.POLKADOT)
            expect(proposal).toBeUndefined()
        })
        it('find', async () => {
            const proposals = await getService().getProposals({
                indexes: [72],
                networkId: NETWORKS.POLKADOT,
                onChain: true,
                paginatedParams: new PaginatedParams({})
            })
            expect(Array.isArray(proposals)).toBe(true)
            expect(proposals).toHaveLength(0)
        })
    })
    describe('bounty', () => {
        it('findOne', async () => {
            const bounty = await getService().getBounty(72, NETWORKS.POLKADOT)
            expect(bounty).toBeUndefined()
        })
        it('find', async () => {
            const bounties = await getService().getBounties({
                indexes: [72],
                networkId: NETWORKS.POLKADOT,
                onChain: true,
                paginatedParams: new PaginatedParams({})
            })
            expect(Array.isArray(bounties)).toBe(true)
            expect(bounties).toHaveLength(0)
        })
    })
})
