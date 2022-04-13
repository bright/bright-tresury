import computeMedian from './medianUtil'
import { NetworkPlanckValue } from '../types'

describe('medianUtils', () => {
    describe('computeMedian', () => {
        it('should return middle value for odd length array', () => {
            const result = computeMedian([
                '20' as NetworkPlanckValue,
                '10' as NetworkPlanckValue,
                '30' as NetworkPlanckValue,
                '0' as NetworkPlanckValue,
                '40' as NetworkPlanckValue,
            ])
            expect(result).toBe('20' as NetworkPlanckValue)
        })
        it('should return avg of two middle elements for even length array', () => {
            const result = computeMedian([
                '20' as NetworkPlanckValue,
                '10' as NetworkPlanckValue,
                '30' as NetworkPlanckValue,
                '50' as NetworkPlanckValue,
            ])
            expect(result).toBe('25' as NetworkPlanckValue)
        })
        it('should return 0 for empty array array', () => {
            const result = computeMedian([])
            expect(result).toBe('0' as NetworkPlanckValue)
        })
    })
})
