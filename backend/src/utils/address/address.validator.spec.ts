import {isValidAddress, IsValidAddressConstraint} from "./address.validator";
import {ValidationArguments} from "class-validator";

describe('address validator', () => {
    it('correct address is valid', () => {
        const validAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
        expect(isValidAddress(validAddress)).toBeTruthy()
    })
    it('wrong address is invalid', () => {
        const validAddress = '5GrwvaEF5zXb26Fz9rcQ'
        expect(isValidAddress(validAddress)).toBeFalsy()
    })
    it('empty address is invalid', () => {
        const validAddress = ''
        expect(isValidAddress(validAddress)).toBeFalsy()
    })
})

describe('address validator constraint', () => {
    const constraint = new IsValidAddressConstraint()

    it('correct address is valid', () => {
        const validAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
        expect(constraint.validate(validAddress, {} as ValidationArguments))
            .toBeTruthy()
    })
    it('wrong address is invalid', () => {
        const validAddress = '5GrwvaEF5zXb26Fz9'
        expect(constraint.validate(validAddress, {} as ValidationArguments))
            .toBeFalsy()
    })
    it('empty address is valid', () => {
        const validAddress = ''
        expect(constraint.validate(validAddress, {} as ValidationArguments))
            .toBeTruthy()
    })
})
