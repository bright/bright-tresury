import {
    hasPositiveDigit,
    isDecimal,
    isNotNegative,
    isValidNumber, toFixedDecimals,
    toNetworkDisplayValue,
    toNetworkPlanckValue,
} from './quota.util'
import { NetworkDisplayValue, NetworkPlanckValue } from './types'


describe('quota util', () => {
    describe('isValidNumber', () => {
        test('should return true for valid number with single dot', () => {
            expect(isValidNumber('123.456')).toBeTruthy()
        })
        test('should return true for valid number without fraction part', () => {
            expect(isValidNumber('123456')).toBeTruthy()
        })
        test('should return false for number with two dots', () => {
            expect(isValidNumber('1.23.456')).toBeFalsy()
        })
        test('should return false for number dot as last character', () => {
            expect(isValidNumber('123456.')).toBeFalsy()
        })
        test('should return false for number dot as first character', () => {
            expect(isValidNumber('.123456')).toBeFalsy()
        })
        test('should return false for negative number', () => {
            expect(isValidNumber('-1')).toBeFalsy()
        })
    })
    describe('isNotNegative', () => {
        test('should return true for positive number', () => {
            expect(isNotNegative('1')).toBeTruthy()
        })
        test('should return false for negative number', () => {
            expect(isNotNegative('-1')).toBeFalsy()
        })
    })
    describe('hasPositiveDigit', () => {
        test('should return true if contains at least one positive digit', () => {
            expect(hasPositiveDigit('a1d')).toBeTruthy()
        })
        test('should return false if does not contains at least one positive digit', () => {
            expect(hasPositiveDigit('a0d')).toBeFalsy()
        })
    })
    describe('isDecimal', () => {
        test('should return true if number contains full part and fractional part', () => {
            expect(isDecimal('123.456')).toBeTruthy()
        })
        test('should return false if number does not contain fractional part', () => {
            expect(isDecimal('123456')).toBeFalsy()
        })
    })
    describe('isCorrectDecimalPrecision', () => {
        test('should return true if number contains no more than', () => {
            expect(isDecimal('123.456')).toBeTruthy()
        })
        test('should return false if number does not contain fractional part', () => {
            expect(isDecimal('123456')).toBeFalsy()
        })
    })
    describe('toNetworkPlanckValue', () => {
        test('should convert to correct amount in plancks', () => {
            expect(toNetworkPlanckValue('1' as NetworkDisplayValue, 1)).toBe('10')
            expect(toNetworkPlanckValue('1' as NetworkDisplayValue, 2)).toBe('100')
            expect(toNetworkPlanckValue('1.1' as NetworkDisplayValue, 1)).toBe('11')
            expect(toNetworkPlanckValue('11.111' as NetworkDisplayValue, 5)).toBe('1111100')
        })
        test('should remove zero from beginning', () => {
            expect(toNetworkPlanckValue('0.1' as NetworkDisplayValue, 1)).toBe('1')
            expect(toNetworkPlanckValue('0.01' as NetworkDisplayValue, 2)).toBe('1')
            expect(toNetworkPlanckValue('0.010' as NetworkDisplayValue, 3)).toBe('10')
        })
        test('should remove decimals if NetworkDisplayValue to precise', () =>{
            expect(toNetworkPlanckValue('1.11' as NetworkDisplayValue, 1)).toBe('11')
            expect(toNetworkPlanckValue('0.01' as NetworkDisplayValue, 1)).toBe('0')
        })
        test('should return 0 for 0 NetworkDisplayValue', () =>{
            expect(toNetworkPlanckValue('0' as NetworkDisplayValue, 1)).toBe('0')
        })
        test('should return undefined for negative number', () => {
            expect(toNetworkPlanckValue('-1' as NetworkDisplayValue, 1)).toBeUndefined()
        })
        test('should return undefined for NaN', () => {
            expect(toNetworkPlanckValue('abc13' as NetworkDisplayValue, 1)).toBeUndefined()
        })
    })
    describe('toNetworkDisplayValue', () => {
        test('should return correct display value', () => {
            expect(toNetworkDisplayValue('111' as NetworkPlanckValue, 1)).toBe('11.1')
            expect(toNetworkDisplayValue('1110' as NetworkPlanckValue, 1)).toBe('111')
            expect(toNetworkDisplayValue('1' as NetworkPlanckValue, 1)).toBe('0.1')
            expect(toNetworkDisplayValue('0' as NetworkPlanckValue, 1)).toBe('0')
            expect(toNetworkDisplayValue('1' as NetworkPlanckValue, 2)).toBe('0.01')
            expect(toNetworkDisplayValue('10' as NetworkPlanckValue, 2)).toBe('0.1')
        })
    })
    describe('toFixedDecimals', () => {
        test('should return fixed amount of decimals', () => {
            expect(toFixedDecimals('1' as NetworkDisplayValue, 3)).toBe('1.000')
            expect(toFixedDecimals('1.1' as NetworkDisplayValue, 3)).toBe('1.100')
            expect(toFixedDecimals('1.11' as NetworkDisplayValue, 3)).toBe('1.110')
            expect(toFixedDecimals('1.111' as NetworkDisplayValue, 3)).toBe('1.111')
            expect(toFixedDecimals('1.1111' as NetworkDisplayValue, 3)).toBe('1.111')
        })
    })
})
