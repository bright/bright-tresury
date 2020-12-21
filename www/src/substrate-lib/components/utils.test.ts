import BN from "bn.js";
import {InputParam} from "./SubmittingTransaction";
import {transformParams} from "./utils";

describe('transform params', () => {
    test('long integer value integer value', () => {
        const inputParams = [{name: 'Name', type: 'Compact<Balance>', value: '100000000000000'} as InputParam]
        const actual = transformParams(inputParams, 15)
        expect(actual.length).toBe(1);
        expect(actual[0]).toBeInstanceOf(BN);
        expect(actual[0].toString()).toBe('100000000000000000000000000000');
    });

    test('decimal value', () => {
        const inputParams = [{name: 'Name', type: 'Compact<Balance>', value: '1.2345'} as InputParam]
        const actual = transformParams(inputParams, 15)
        expect(actual.length).toBe(1);
        expect(actual[0]).toBeInstanceOf(BN);
        expect(actual[0].toString()).toBe('1234500000000000');
    });

    test('decimal value without leading zero', () => {
        const inputParams = [{name: 'Name', type: 'Compact<Balance>', value: '.2345'} as InputParam]
        const actual = transformParams(inputParams, 15)
        expect(actual.length).toBe(1);
        expect(actual[0]).toBeInstanceOf(BN);
        expect(actual[0].toString()).toBe('234500000000000');
    });

    test('decimal value with leading zero', () => {
        const inputParams = [{name: 'Name', type: 'Compact<Balance>', value: '0.2345'} as InputParam]
        const actual = transformParams(inputParams, 15)
        expect(actual.length).toBe(1);
        expect(actual[0]).toBeInstanceOf(BN);
        expect(actual[0].toString()).toBe('234500000000000');
    });

})
