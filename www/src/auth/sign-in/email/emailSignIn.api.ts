import { useMutation } from 'react-query'
import { apiPost } from '../../../api'
import {
    supertokensRequestConfig,
    transformSignInRequestData,
} from '../../supertokens.utils/transformRequestData.utils'
import { SignInAPIResponse } from '../../supertokens.utils/types'
import { SignInData } from './emailSignIn.dto'

export function signIn(data: SignInData) {
    const requestData = transformSignInRequestData(data)
    return apiPost<SignInAPIResponse>(`/auth/signin`, requestData, supertokensRequestConfig).then((response: any) => {
        switch (response.status) {
            case 'OK':
                return response
            case 'FIELD_ERROR': // SuperTokens "FIELD_ERROR" when email is not a valid email string
            case 'WRONG_CREDENTIALS_ERROR':
                throw new Error('WRONG_CREDENTIALS_ERROR')
            case 'ACCOUNT_TEMPORARY_LOCKED':
                throw new Error('ACCOUNT_TEMPORARY_LOCKED')
        }
    })
}

export const useSignIn = () => {
    return useMutation(signIn)
}
