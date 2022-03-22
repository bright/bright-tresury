import { useMutation } from 'react-query'
import { apiPost } from '../../api'
import { transformBasicRequestData } from '../supertokens.utils/transformRequestData.utils'

export interface PasswordRecoveryData {
    email: string
}

export function passwordRecovery(value: PasswordRecoveryData) {
    const data = transformBasicRequestData(value)
    return apiPost<void>(`auth/user/password/reset/token`, data)
}

export const usePasswordRecovery = () => {
    return useMutation(passwordRecovery)
}
