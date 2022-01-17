import { useMutation } from 'react-query'
import { apiPost } from '../../../api'
import {
    supertokensRequestConfig,
    transformSignUpRequestData,
} from '../../supertokens.utils/transformRequestData.utils'
import { SendVerifyEmailAPIResponse, SignUpAPIResponse } from '../../supertokens.utils/types'
import { sendVerifyEmail } from '../../verifyEmail/verifyEmail.api'
import { FieldError, SignUpData } from './emailSignUp.dto'

async function signUp(data: SignUpData) {
    const requestData = transformSignUpRequestData(data)

    return apiPost<SignUpAPIResponse | SendVerifyEmailAPIResponse>(
        `/auth/signup`,
        requestData,
        supertokensRequestConfig,
    ).then((response) => {
        switch (response.status) {
            case 'OK':
                return sendVerifyEmail()
            case 'FIELD_ERROR':
                throw new FieldError(response.formFields)
        }
    })
}

export const useSignUp = () => {
    return useMutation(signUp)
}
