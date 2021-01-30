import {decodeAddress, encodeAddress} from "@polkadot/keyring";
import {hexToU8a, isHex} from "@polkadot/util";
import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

export function isValidAddress(address: string): boolean {
    try {
        encodeAddress(
            isHex(address)
                ? hexToU8a(address)
                : decodeAddress(address)
        );
        return true;
    } catch (error) {
        return false;
    }
};

@ValidatorConstraint({name: 'invalidAddress', async: false})
export class IsValidAddressConstraint implements ValidatorConstraintInterface {
    validate(address: string, args: ValidationArguments) {
        return !address || isValidAddress(address)
    }

    defaultMessage(args: ValidationArguments) {
        return 'Account ($value) is invalid!';
    }
}

export function IsValidAddress(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidAddressConstraint,
        });
    };
}
