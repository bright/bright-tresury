import {FormikErrors} from "formik/dist/types";
import {ObjectSchema} from "yup";

/*
 * Formik does not support multiple errors
 * This is a custom validate function, which returns an array of error messages
 * FieldMetaProps.error field will be an array of strings instead of a simple string
 * Use errorsToString and errorsToArray functions to access FieldMetaProps.error
 */
export function validateFull<T>(validationSchema: ObjectSchema<any>): (values: T) => Promise<FormikErrors<T>> {
    return (values: T) => validationSchema.validate(values, {
        abortEarly: false
    })
        .then((result) => {
            return result
        })
        .catch((error) => {
            let errors: any = {}
            error.inner.forEach((e: any) => {
                if (!errors[e.path]) {
                    errors[e.path] = []
                }
                errors[e.path].push(...e.errors)
            })
            return errors
        })
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
