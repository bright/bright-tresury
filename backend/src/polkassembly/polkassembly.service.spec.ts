import { beforeSetupFullApp, NETWORKS } from '../utils/spec.helpers'
import { PolkassemblyService } from './polkassembly.service'


describe('proposal-polkassembly.service', () => {
    const app = beforeSetupFullApp()
    const getService = () => app().get(PolkassemblyService)
    it('findOne', async () => {
        const proposal = await getService().getProposal(72, NETWORKS.POLKADOT)
        expect(proposal).toBeUndefined()
    })
    it('find', async () => {
        const proposals = await getService().getProposals([72],NETWORKS.POLKADOT)
        expect(Array.isArray(proposals)).toBe(true)
        expect(proposals).toHaveLength(0)
    })
})
