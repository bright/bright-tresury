import {FormikErrors} from "formik/dist/types";
import {ObjectSchema} from "yup";

/*
 * Formik does not support multiple errors
 * This is a custom validate function, which returns an array of error messages
 * FieldMetaProps.error field will be an array of strings instead of a simple string
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
