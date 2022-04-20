import { beforeAllSetup, beforeSetupFullApp } from '../../utils/spec.helpers'
import { PolkassemblyTipsService } from './polkassembly-tips.service'
import { PolkassemblyService } from '../polkassembly.service'
import { request, GraphQLClient } from 'graphql-request'

describe.skip('PolkassemblyTipsService', () => {
    const app = beforeSetupFullApp()
    const service = beforeAllSetup(() => app().get<PolkassemblyTipsService>(PolkassemblyTipsService))

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
        it('should find tips posts with hashes', async () => {
            const tip = await service().find({
                networkId: '',
                includeHashes: ['0x104a0b13dcc86a4a7c393ea3f8a30965b04a259108618adac9ee3f7a15a6b7d4'],
                excludeHashes: null,
            })
            console.log(tip)
        })
    })
})
