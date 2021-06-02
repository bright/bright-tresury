import {calculateBondValue} from "./bondUtil";

describe('bond value', () => {
    test('calculates 5% of bond value', () => {
        const bondValue = calculateBondValue(100000)
        expect(bondValue).toBe(5000);
    })
    test('takes min amount if calculated bond is less than min amount', () => {
        const bondValue = calculateBondValue(1000)
        expect(bondValue).toBe(1000);
    })
    test('takes min amount if calculated bond is higher than min amount but negative', () => {
        const bondValue = calculateBondValue(-100000)
        expect(bondValue).toBe(1000);
    })
})
