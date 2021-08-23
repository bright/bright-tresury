import { formatAddress } from './utils'

describe('formatAddress', () => {
    const polkadotAddress = '12TpXjttC29ZBEwHqdmbEtXJ9JSR9NZm2nxsrMwfXUHoxX6U'
    const kusamaAddress = 'E393iygxbu1VMkDehXdzh49SGj1FjpoQg595jEGTBUnXS9m'
    const baseAddress = '5DXXPQdpLEt5jhvmszib6jh9HgSmT51cxJEPh4xJyPGHnKyJ'

    it(`should return Polkadot encoded address from base encoded address`, () => {
        const result = formatAddress(baseAddress, 0, false)
        expect(result).toBe(polkadotAddress)
    })

    it(`should return Polkadot encoded address from Kusama encoded address`, () => {
        const result = formatAddress(kusamaAddress, 0, false)
        expect(result).toBe(polkadotAddress)
    })

    it(`should return base encoded address from Polkadot encoded address`, () => {
        const result = formatAddress(polkadotAddress, 42, false)
        expect(result).toBe(baseAddress)
    })

    it(`should return elipsed address`, () => {
        const result = formatAddress(polkadotAddress, 0, true)
        expect(result).toBe('12TpXj...HoxX6U')
    })

    it(`should return empty string when empty address`, () => {
        const result = formatAddress('', 0, true)
        expect(result).toBe('')
    })

    it(`should return empty string when undefined address`, () => {
        const result = formatAddress(undefined, 0, true)
        expect(result).toBe('')
    })
})
