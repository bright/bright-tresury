import {SendVerifyEmailAPIResponse} from 'supertokens-auth-react/lib/build/recipe/emailverification/types'
import {StartEmailPasswordAssociateRequestDto} from "../../../../../backend/src/auth/email-password/associate/dto/start.request.dto";
import {apiPost} from '../../../api'
import {Account} from "../../../substrate-lib/hooks/useAccounts";
import {sendVerifyEmail} from '../../auth.api'
import {handleWeb3Sign, StartWeb3SignResponseDto} from "../../handleWeb3Sign";

export interface StartEmailPasswordAssociateDto {
    address: string
    details: EmailPasswordAssociateDetailsDto
}

export interface EmailPasswordAssociateDetailsDto {
    email: string
    username: string
    password: string
}

export type ConfirmEmailPasswordAssociateDto = StartEmailPasswordAssociateRequestDto & { signature: string }

export async function associateEmailPassword(account: Account, details: EmailPasswordAssociateDetailsDto) {
    return await handleWeb3Sign(account, startEmailPasswordAssociation, confirmEmailPasswordAssociation, details)
}

function startEmailPasswordAssociation(dto: StartEmailPasswordAssociateDto): Promise<StartWeb3SignResponseDto> {
    return apiPost<StartWeb3SignResponseDto>(`/auth/email-password/associate/start`, dto)
}

function confirmEmailPasswordAssociation(dto: ConfirmEmailPasswordAssociateDto): Promise<void | SendVerifyEmailAPIResponse> {
    return apiPost<void | SendVerifyEmailAPIResponse>('/auth/email-password/associate/confirm', dto).then(() => {
        return sendVerifyEmail()
    })
}
