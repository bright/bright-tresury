import {transformBalance} from "./utils";
import BN from "bn.js";

const decimals = 15

describe('transform balance', () => {
    test('very big value', () => {
        const actual = transformBalance('6000000000000000000000000', decimals, 10)
        expect(actual).toBe(6000000000);
    });

    test('value of 1', () => {
        const actual = transformBalance('1000000000000000', decimals, 10)
        expect(actual).toBe(1);
    });

    test('very small value', () => {
        const actual = transformBalance('2', decimals, 10)
        expect(actual).toBe(0.000000000000002);
    });

    test('hex value', () => {
        const actual = transformBalance('000000000000000000b1a2bc2ec50000', decimals)
        expect(actual).toBe(50);
    });

    test('BN value', () => {
        const actual = transformBalance(new BN('000000000000000000b1a2bc2ec50000', 'hex'), decimals)
        expect(actual).toBe(50);
    });
})
