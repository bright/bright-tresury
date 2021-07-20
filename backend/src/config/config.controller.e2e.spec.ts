import { beforeSetupFullApp, request } from '../utils/spec.helpers'

describe('GET blockchains configurations', () => {
    const app = beforeSetupFullApp()
    it('response should be an array and have expected fields', async () => {
        const blockchainsConfigurationResponse = await request(app()).get('/api/v1/configuration/blockchains').send()
        expect(blockchainsConfigurationResponse.ok).toBe(true)

        const blockchainsConfiguration = blockchainsConfigurationResponse.body
        expect(Array.isArray(blockchainsConfiguration)).toBe(true)

        const expectedKeys = [
            'id',
            'name',
            'url',
            'types',
            'rpc',
            'developmentKeyring',
            'ss58Format',
            'genesisHash',
            'bond',
            'currency',
            'decimals',
            'color',
            'isDefault',
            'isLiveNetwork',
        ]

        for (const blockchainConfiguration of blockchainsConfiguration) {
            expect(Object.keys(blockchainConfiguration)).toEqual(expect.arrayContaining(expectedKeys))
        }
    })
})
