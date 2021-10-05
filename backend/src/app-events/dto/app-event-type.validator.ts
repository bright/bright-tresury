import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { AppEventType } from '../entities/app-event-type'

export function isValidAppEventType(appEventType: string): boolean {
    return !!Object.values(AppEventType).find((value) => value === appEventType)
}

@ValidatorConstraint({ name: 'invalidAppEventType', async: false })
export class IsValidAppEventConstraint implements ValidatorConstraintInterface {
    validate(appEventType: string, args: ValidationArguments) {
        return isValidAppEventType(appEventType)
    }

    defaultMessage(args: ValidationArguments) {
        return 'AppEventType ($value) is invalid'
    }
}

export function IsValidAppEventType(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidAppEventConstraint,
        })
    }
}
