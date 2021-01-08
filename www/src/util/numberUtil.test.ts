import {formatNumber} from "./numberUtil";

describe('formats number to string', () => {
    test('formats thousands once', () => {
        const formattedNumber = formatNumber(199000.47)
        expect(formattedNumber).toBe('199,000.47');
    })
    test('formats thousands twice', () => {
        const formattedNumber = formatNumber(111222333.92)
        expect(formattedNumber).toBe('111,222,333.92');
    })
    test('formats thousands four times', () => {
        const formattedNumber = formatNumber(111222333444555.92)
        expect(formattedNumber).toBe('111,222,333,444,555.92');
    })
    test('does not add commas when there are no thousands', () => {
        const formattedNumber = formatNumber(111.12)
        expect(formattedNumber).toBe('111.12');
    })
    test('format integers properly', () => {
        const formattedNumber = formatNumber(999)
        expect(formattedNumber).toBe('999');
    })
    test('format integers with thousands properly', () => {
        const formattedNumber = formatNumber(999888)
        expect(formattedNumber).toBe('999,888');
    })
    test('formats 0 properly', () => {
        const formattedNumber = formatNumber(0)
        expect(formattedNumber).toBe('0');
    })
    test('formats 0.0000 properly', () => {
        const formattedNumber = formatNumber(0.000000)
        expect(formattedNumber).toBe('0');
    })
    test('formats 30000.000000000000000 properly', () => {
        const formattedNumber = formatNumber(30000.000000000000000)
        expect(formattedNumber).toBe('30,000');
    })
})
