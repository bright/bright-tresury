import { compareWeb3Address } from './web3address.util'

describe('compareWeb3Address', () => {
    it('should return true if both values are the same not-base encoded', () => {
        const result = compareWeb3Address(
            '126TwBzBM4jUEK2gTphmW4oLoBWWnYvPp8hygmduTr4uds57',
            '126TwBzBM4jUEK2gTphmW4oLoBWWnYvPp8hygmduTr4uds57',
        )
        expect(result).toBe(true)
    })
    it('should return true if both values are the same base encoded', () => {
        const result = compareWeb3Address(
            '5FfBQ3kwXrbdyoqLPvcXRp7ikWydXawpNs2Ceu3WwFdhZ8W4',
            '5FfBQ3kwXrbdyoqLPvcXRp7ikWydXawpNs2Ceu3WwFdhZ8W4',
        )
        expect(result).toBe(true)
    })
    it('should return true if both values are the same: one base, one not-base', () => {
        const result = compareWeb3Address(
            '12TpXjttC29ZBEwHqdmbEtXJ9JSR9NZm2nxsrMwfXUHoxX6U',
            '5DXXPQdpLEt5jhvmszib6jh9HgSmT51cxJEPh4xJyPGHnKyJ',
        )
        expect(result).toBe(true)
    })
    it('should return false if different values, same encode', () => {
        const result = compareWeb3Address(
            '5Fea4aBRG6DgR6NxmcAGDP3iasVUfRDg3r9cowfiepiMaa6h',
            '5FfBQ3kwXrbdyoqLPvcXRp7ikWydXawpNs2Ceu3WwFdhZ8W4',
        )
        expect(result).toBe(false)
    })
    it('should return false if different values, different encoded', () => {
        const result = compareWeb3Address(
            '5Fea4aBRG6DgR6NxmcAGDP3iasVUfRDg3r9cowfiepiMaa6h',
            '12TpXjttC29ZBEwHqdmbEtXJ9JSR9NZm2nxsrMwfXUHoxX6U',
        )
        expect(result).toBe(false)
    })
    it('should return false if one value not valid', () => {
        const result = compareWeb3Address('a', '12TpXjttC29ZBEwHqdmbEtXJ9JSR9NZm2nxsrMwfXUHoxX6U')
        expect(result).toBe(false)
    })
    it('should return false if both values not valid', () => {
        const result = compareWeb3Address('a', 'a')
        expect(result).toBe(false)
    })
})
