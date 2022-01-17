import { APIFormField } from 'supertokens-auth-react/lib/build/types'
import { SignInData } from '../sign-in/email/emailSignIn.dto'
import { SignUpData } from '../sign-up/email/emailSignUp.dto'

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

function transformBasicRequestData(data: { password: string; email: string }): { formFields: APIFormField[] } {
    const { email, password } = data
    return {
        formFields: [
            {
                id: EMAIL_FIELD_NAME,
                value: email,
            },
            {
                id: PASSWORD_FIELD_NAME,
                value: password,
            },
        ],
    }
}

export const supertokensRequestConfig = { headers: { rid: 'emailpassword' } }
