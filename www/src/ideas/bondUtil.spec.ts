import { calculateBondValue } from './bondUtil'
import { NetworkPlanckValue } from '../util/types'

describe('bond value', () => {
    const bondPercent = 5
    const bondMin = '1000' as NetworkPlanckValue
    const bondMax = '5000' as NetworkPlanckValue
    const oldVersion = 1500
    const newVersion = 1900
    test('calculates 5% of bond value when there is a new version of the network', () => {
        const bondValue = calculateBondValue(
            '100000000' as NetworkPlanckValue,
            bondPercent,
            bondMin,
            bondMax,
            newVersion,
        )
        expect(bondValue).toBe('5000')
    })
    test('calculates 5% of bond value when there is an old version of the network', () => {
        const bondValue = calculateBondValue(
            '10000000000' as NetworkPlanckValue,
            bondPercent,
            bondMin,
            bondMax,
            oldVersion,
        )
        expect(bondValue).toBe('500000000')
    })
    test('takes min amount if calculated bond is less than min amount', () => {
        const bondValue = calculateBondValue('1000' as NetworkPlanckValue, bondPercent, bondMin, bondMax, newVersion)
        expect(bondValue).toBe('1000')
    })
    test('takes max amount if calculated bond is greater than curren amount', () => {
        const bondValue = calculateBondValue(
            '10000000000' as NetworkPlanckValue,
            bondPercent,
            bondMin,
            bondMax,
            newVersion,
        )
        expect(bondValue).toBe('5000')
    })
})
