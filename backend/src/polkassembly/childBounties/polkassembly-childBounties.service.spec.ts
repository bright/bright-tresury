import { beforeAllSetup, beforeSetupFullApp, NETWORKS } from '../../utils/spec.helpers'
import { PolkassemblyService } from '../polkassembly.service'
import { request } from 'graphql-request'
import { PolkassemblyChildBountiesService } from './polkassembly-childBounties.service'
import { PolkassemblyChildBountyPostDto } from './childBounty-post.dto'

describe.skip('PolkassemblyChildBountiesService', () => {
    const app = beforeSetupFullApp()
    const service = beforeAllSetup(() => app().get<PolkassemblyChildBountiesService>(PolkassemblyChildBountiesService))

    beforeAll(() => {
        jest.spyOn(app().get(PolkassemblyService), 'executeQuery').mockImplementation(
            async (networkId: string, query: string, variables: any) => {
                console.log(query, variables)
                return request('https://polkadot.polkassembly.io/v1/graphql', query, variables)
            },
        )
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe('find', () => {
        it('should find child bounties posts', async () => {
            const childBounty = await service().find({
                networkId: NETWORKS.POLKADOT,
            })
            console.log(childBounty)
        })

        it('should return PolkassemblyChildBountyPostDto', async () => {
            const childBounty = await service().find({
                networkId: '',
            })

            expect(childBounty[0]).toBeInstanceOf(PolkassemblyChildBountyPostDto)
            expect(Array.isArray(childBounty)).toBe(true)
        })
    })
})
