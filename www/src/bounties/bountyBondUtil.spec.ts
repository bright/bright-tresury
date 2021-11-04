import { NetworkPlanckValue } from '../util/types'
import { calculateBondValue } from './bountyBondUtil'

describe('calculateBondValue', () => {
    const baseDeposit = '100' as NetworkPlanckValue
    const depositPerByte = '1' as NetworkPlanckValue
    it('should calculate base value when no description', () => {
        const bondValue = calculateBondValue('', baseDeposit, depositPerByte)
        expect(bondValue).toBe('100')
    })
    test('should add deposit per byte for description', () => {
        const bondValue = calculateBondValue('🤗123żą', baseDeposit, depositPerByte)
        expect(bondValue).toBe('111')
    })
})
