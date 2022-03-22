import { APIFormField } from 'supertokens-auth-react/lib/build/types'
import { SignInData } from '../sign-in/email/emailSignIn.dto'
import { SignUpData } from '../sign-up/email/emailSignUp.dto'
import { Nil } from '../../util/types'

const EMAIL_FIELD_NAME = 'email'
const PASSWORD_FIELD_NAME = 'password'

export function transformSignInRequestData(data: SignInData) {
    return transformBasicRequestData(data)
}

export function transformSignUpRequestData(data: SignUpData) {
    const requestData = transformBasicRequestData(data)
    requestData.formFields.push({
        id: 'username',
        value: data.username,
    })
    return requestData
}

export function transformBasicRequestData(data: { password?: Nil<string>; email?: Nil<string> }): {
    formFields: APIFormField[]
} {
    const { email, password } = data
    const requestData: { formFields: APIFormField[] } = {
        formFields: [],
    }
    if (password) {
        requestData.formFields.push({
            id: PASSWORD_FIELD_NAME,
            value: password,
        })
    }
    if (email) {
        requestData.formFields.push({
            id: EMAIL_FIELD_NAME,
            value: email,
        })
    }

    return requestData
}

export const supertokensRequestConfig = { headers: { rid: 'emailpassword' } }
