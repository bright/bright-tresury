import { useMutation } from 'react-query'
import { apiPost } from '../../api'
import { transformBasicRequestData } from '../supertokens.utils/transformRequestData.utils'

function newPassword(value: { password: string; token: string }): Promise<void> {
    const { formFields } = transformBasicRequestData(value)
    const data = { formFields, method: 'token', token: value.token }
    return apiPost(`auth/user/password/reset`, data)
}

export const useNewPassword = () => {
    return useMutation(newPassword)
}
