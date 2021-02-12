import {FormikErrors} from "formik/dist/types";
import {ObjectSchema} from "yup";

/*
 * Formik does not support multiple errors
 * This is a custom validate function, which returns an array of error messages
 * FieldMetaProps.error field will be an array of strings instead of a simple string
 * Use errorsToString and errorsToArray functions to access FieldMetaProps.error
 */
export function fullValidatorForSchema<T>(schema: ObjectSchema<any>) {
    return (values: T) => schema.validate(values, {
        abortEarly: false,
        strict: false,
    }).then(() => ({})).catch(({inner}: any) => inner.reduce((memo: any, {path, message}: any) => ({
        ...memo,
        [path]: (memo[path] || []).concat(message),
    }), {}))
}


export function formikErrorToString(errors?: string | string[]): string | undefined {
    if (!errors) {
        return undefined
    }
    if (!Array.isArray(errors)) {
        return errors
    } else if (errors.length > 0) {
        return errors[0]
    } else {
        return undefined
    }
}

export function formikErrorToArray(errors?: string | string[]): string[] | undefined {
    if (!errors) {
        return undefined
    }
    return Array.isArray(errors) ? errors : [errors]
}
