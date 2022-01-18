import { useMutation } from 'react-query'
import { apiPost } from '../../api'
import { supertokensRequestConfig } from '../supertokens.utils/transformRequestData.utils'
import { SendVerifyEmailAPIResponse } from '../supertokens.utils/types'

export function sendVerifyEmail() {
    return apiPost<SendVerifyEmailAPIResponse>('auth/user/email/verify/token', null, supertokensRequestConfig).then(
        (response) => {
            switch (response.status) {
                case 'OK':
                    return response
                case 'EMAIL_ALREADY_VERIFIED_ERROR':
                    throw new Error('EMAIL_ALREADY_VERIFIED_ERROR')
            }
        },
    )
}

export const useSendVerifyEmail = () => {
    return useMutation(sendVerifyEmail)
}

function verifyEmail(token: string) {
    return apiPost<void>(`/auth/email-password/verify/${token}`, null)
}

export const useVerifyEmail = () => {
    return useMutation(verifyEmail)
}
