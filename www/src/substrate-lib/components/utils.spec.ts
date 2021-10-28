import BN from 'bn.js'
import { InputParam } from './SubmittingTransaction'
import { transformParams } from './utils'

describe('transform params', () => {
    test('long integer value integer value', () => {
        const inputParams = [{ name: 'Name', type: 'Compact<Balance>', value: '100000000000000' } as InputParam]
        const actual = transformParams(inputParams)
        expect(actual.length).toBe(1)
        expect(actual[0]).toBeInstanceOf(BN)
        expect(actual[0].toString()).toBe('100000000000000')
    })
})
