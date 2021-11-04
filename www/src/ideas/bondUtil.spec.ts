import { calculateBondValue } from './bondUtil'
import { NetworkPlanckValue } from '../util/types'

describe('bond value', () => {
    const bondPercent = 5
    const bondMin = '1000' as NetworkPlanckValue
    test('calculates 5% of bond value', () => {
        const bondValue = calculateBondValue('100000' as NetworkPlanckValue, bondPercent, bondMin)
        expect(bondValue).toBe('5000')
    })
    test('takes min amount if calculated bond is less than min amount', () => {
        const bondValue = calculateBondValue('1000' as NetworkPlanckValue, bondPercent, bondMin)
        expect(bondValue).toBe('1000')
    })
})
