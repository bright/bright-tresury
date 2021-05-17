import { SignUpAPIResponse } from 'supertokens-auth-react/lib/build/recipe/emailpassword/types'
import { SendVerifyEmailAPIResponse } from 'supertokens-auth-react/lib/build/recipe/emailverification/types'
import { apiPost } from '../../api'
import { sendVerifyEmail, SignUpData } from '../auth.api'
import { transformSignUpRequestData } from '../supertokens.utils/transformRequestData.utils'
import { ConfirmBlockchainSignDto, Web3SignStartResponse } from '../auth-web3.api'

export function addEmailPassword(data: SignUpData) {
    /*
    TODO use other api endpoint to update email password data
     */
    const requestData = transformSignUpRequestData(data)

    return apiPost<SignUpAPIResponse | SendVerifyEmailAPIResponse>(`/signup`, requestData).then((result) => {
        if (result.status === 'OK') {
            return sendVerifyEmail()
        } else {
            return result
        }
    })
}

export function startWeb3Association(address: string): Promise<Web3SignStartResponse> {
    return apiPost<Web3SignStartResponse>(`/v1/auth/web3/associate/start`, { address })
}

export function confirmWeb3Association(address: ConfirmBlockchainSignDto): Promise<void> {
    return apiPost<void>('/v1/auth/web3/associate/confirm', address)
}

export function unlinkAddress(address: string) {
    return apiPost('/v1/auth/web3/unlink', { address })
}

export function makePrimary(address: string) {
    return apiPost('/v1/auth/web3/make-primary', { address })
}
