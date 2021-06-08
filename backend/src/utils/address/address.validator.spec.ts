import { isValidAddress, IsValidAddressConstraint } from './address.validator'
import { ValidationArguments } from 'class-validator'

describe('address validator', () => {
    it('correct address is valid', () => {
        const validAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
        expect(isValidAddress(validAddress)).toBeTruthy()
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
    const constraint = new IsValidAddressConstraint()

    it('correct address is valid', () => {
        const validAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
        expect(constraint.validate(validAddress, {} as ValidationArguments)).toBeTruthy()
    })
    it('wrong address is invalid', () => {
        const invalidAddress = '5GrwvaEF5zXb26Fz9'
        expect(constraint.validate(invalidAddress, {} as ValidationArguments)).toBeFalsy()
    })
    it('empty address is valid', () => {
        const emptyAddress = ''
        expect(constraint.validate(emptyAddress, {} as ValidationArguments)).toBeTruthy()
    })
})
