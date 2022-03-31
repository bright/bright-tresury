import { isValidAddress, isValidAddressOrEmpty } from './addressValidator'

describe('address validator', () => {
    it('correct address is valid', () => {
        const validAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
        expect(isValidAddress(validAddress, 42)).toBeTruthy()
    })
    it('wrong address is invalid', () => {
        const invalidAddress = '5GrwvaEF5zXb26Fz9rcQ'
        expect(isValidAddress(invalidAddress)).toBeFalsy()
    })
    it('empty address is invalid', () => {
        const emptyAddress = ''
        expect(isValidAddress(emptyAddress)).toBeFalsy()
    })
})

describe('address validator constraint', () => {
    it('correct address is valid', () => {
        const validAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
        expect(isValidAddressOrEmpty(validAddress, 42)).toBeTruthy()
    })
    it('wrong address is invalid', () => {
        const invalidAddress = '5GrwvaEF5zXb26Fz9'
        expect(isValidAddressOrEmpty(invalidAddress)).toBeFalsy()
    })
    it('empty address is valid', () => {
        const emptyAddress = ''
        expect(isValidAddressOrEmpty(emptyAddress)).toBeTruthy()
    })
    it('undefined address is valid', () => {
        const undefinedAddress = undefined
        expect(isValidAddressOrEmpty(undefinedAddress)).toBeTruthy()
    })
})
