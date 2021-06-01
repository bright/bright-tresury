import {FormFieldError} from 'supertokens-auth-react/lib/build/recipe/emailpassword/types';

export interface SignUpData {
    email: string
    password: string
    username: string
}

export class FieldError extends Error {
    formFieldErrors: FormFieldError[]

    constructor(formFieldErrors: FormFieldError[], message?: string) {
        super(message)
        this.formFieldErrors = formFieldErrors
    }
}
