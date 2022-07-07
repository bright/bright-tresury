import { beforeSetupFullApp, request } from '../../utils/spec.helpers'
import { HttpStatus } from '@nestjs/common'

describe('GET blockchains configurations', () => {
    const app = beforeSetupFullApp()
    it(`response should have ${HttpStatus.OK} status code`, async () => {
        return request(app()).get('/api/v1/blockchain/configuration').expect(HttpStatus.OK)
    })

    it('response should be an array and have expected fields', async () => {
        const response = await request(app()).get('/api/v1/blockchain/configuration')
        const blockchainsConfiguration = response.body
        expect(Array.isArray(blockchainsConfiguration)).toBe(true)
        for (const blockchainConfiguration of blockchainsConfiguration) {
            const {
                id,
                name,
                url,
                types,
                rpc,
                developmentKeyring,
                ss58Format,
                genesisHash,
                proposals,
                currency,
                decimals,
                color,
                isDefault,
                isLiveNetwork,
                version,
            } = blockchainConfiguration
            expect(typeof id).toBe('string')
            expect(typeof name).toBe('string')
            expect(typeof url).toBe('string')
            expect(types).toBeDefined()
            expect(typeof types).toBe('object')
            expect(rpc).toBeDefined()
            expect(typeof rpc).toBe('object')
            expect(typeof developmentKeyring).toBe('boolean')
            expect(typeof ss58Format).toBe('number')
            expect(typeof genesisHash).toBe('string')
            expect(proposals).toBeDefined()
            expect(typeof proposals).toBe('object')
            expect(typeof proposals.proposalBondMinimum).toBe('string')
            expect(typeof proposals.proposalBond).toBe('number')
            expect(typeof currency).toBe('string')
            expect(typeof decimals).toBe('number')
            expect(typeof color).toBe('string')
            expect(typeof isDefault).toBe('boolean')
            expect(typeof isLiveNetwork).toBe('boolean')
            expect(typeof version).toBe('number')
        }
    })

    it('response should include tips configuration', async () => {
        const response = await request(app()).get('/api/v1/blockchain/configuration')
        const blockchainsConfiguration = response.body
        expect(Array.isArray(blockchainsConfiguration)).toBe(true)
        for (const blockchainConfiguration of blockchainsConfiguration) {
            const { tips } = blockchainConfiguration
            expect(typeof tips.dataDepositPerByte).toBe('string')
            expect(typeof tips.tipReportDepositBase).toBe('string')
            expect(typeof tips.maximumReasonLength).toBe('number')
            expect(typeof tips.tipCountdown).toBe('number')
            expect(tips.tipFindersFee).toBeGreaterThan(0)
            expect(tips.tipFindersFee).toBeLessThan(100)
        }
    })

    it('response should include bounties configuration', async () => {
        const response = await request(app()).get('/api/v1/blockchain/configuration')
        const blockchainsConfiguration = response.body
        expect(Array.isArray(blockchainsConfiguration)).toBe(true)
        for (const blockchainConfiguration of blockchainsConfiguration) {
            const { bounties } = blockchainConfiguration
            expect(typeof bounties).toBe('object')
            expect(typeof bounties.depositBase).toBe('string')
            expect(typeof bounties.dataDepositPerByte).toBe('string')
            expect(typeof bounties.bountyValueMinimum).toBe('string')
            expect(typeof bounties.maximumReasonLength).toBe('number')
        }
    })

    it('response should include childBounties configuration', async () => {
        const response = await request(app()).get('/api/v1/blockchain/configuration')
        const blockchainsConfiguration = response.body
        expect(Array.isArray(blockchainsConfiguration)).toBe(true)
        for (const blockchainConfiguration of blockchainsConfiguration) {
            const { childBounties } = blockchainConfiguration
            expect(typeof childBounties).toBe('object')
            expect(typeof childBounties.childBountyValueMinimum).toBe('string')
            expect(typeof childBounties.maxActiveChildBountyCount).toBe('number')
        }
    })
})
