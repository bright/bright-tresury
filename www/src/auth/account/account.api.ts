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

export interface StartWeb3RequestDto {
    address: string
    password?: string
}

export function startWeb3Association(requestDto: StartWeb3RequestDto): Promise<Web3SignStartResponse> {
    return apiPost<Web3SignStartResponse>(`/auth/web3/associate/start`, requestDto)
}

export function confirmWeb3Association(address: ConfirmBlockchainSignDto): Promise<void> {
    return apiPost<void>('/auth/web3/associate/confirm', address)
}

export function unlinkAddress(address: string) {
    return apiPost('/auth/web3/address/unlink', { address })
}

export function makePrimary(address: string) {
    return apiPost('/auth/web3/address/make-primary', { address })
}
