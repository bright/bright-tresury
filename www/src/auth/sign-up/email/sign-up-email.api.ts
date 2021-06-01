import {useMutation} from "react-query";
import {FormFieldError, SignUpAPIResponse} from 'supertokens-auth-react/lib/build/recipe/emailpassword/types';
import {SendVerifyEmailAPIResponse} from "supertokens-auth-react/lib/build/recipe/emailverification/types";
import {apiPost} from "../../../api";
import { sendVerifyEmail } from '../../auth.api';
import {transformSignUpRequestData} from '../../supertokens.utils/transformRequestData.utils';

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

async function signUp(data: SignUpData) {
    const requestData = transformSignUpRequestData(data)

    return apiPost<SignUpAPIResponse | SendVerifyEmailAPIResponse>( `/signup`, requestData).then((response) => {
        switch (response.status) {
            case "OK":
                return sendVerifyEmail()
            case "FIELD_ERROR":
                throw new FieldError(response.formFields)
        }
    })
}

export const useSignUp = () => {
    return useMutation(signUp)
}
