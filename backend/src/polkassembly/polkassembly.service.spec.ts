import { beforeSetupFullApp, NETWORKS } from '../utils/spec.helpers'
import { PolkassemblyService } from './polkassembly.service'


describe('proposal-polkassembly.service', () => {
    const app = beforeSetupFullApp()
    const getService = () => app().get(PolkassemblyService)
    it('findOne', async () => {
        await getService().getTreasuryProposal(72, NETWORKS.POLKADOT)
    })
    it('find', async () => {
        await getService().getTreasuryProposals([72],NETWORKS.POLKADOT)
    })
})
