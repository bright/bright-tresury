import { useMutation } from 'react-query'
import { SendVerifyEmailAPIResponse } from 'supertokens-auth-react/lib/build/recipe/emailverification/types'
import { apiPost } from '../../../api'
import { Account } from '../../../substrate-lib/accounts/AccountsContext'
import { handleWeb3Sign, StartWeb3SignResponseDto } from '../../handleWeb3Sign'
import { sendVerifyEmail } from '../../verifyEmail/verifyEmail.api'

export interface StartEmailPasswordAssociateDto {
    address: string
    details: EmailPasswordAssociateDetailsDto
}

export interface EmailPasswordAssociateDetailsDto {
    email: string
    username: string
    password: string
}

export type ConfirmEmailPasswordAssociateDto = StartEmailPasswordAssociateDto & { signature: string }

export interface EmailPasswordAssociateDto {
    account: Account
    details: EmailPasswordAssociateDetailsDto
}

async function associateEmailPassword(dto: EmailPasswordAssociateDto) {
    return await handleWeb3Sign(
        dto.account,
        startEmailPasswordAssociation,
        confirmEmailPasswordAssociation,
        dto.details,
    )
}

function startEmailPasswordAssociation(dto: StartEmailPasswordAssociateDto): Promise<StartWeb3SignResponseDto> {
    return apiPost<StartWeb3SignResponseDto>(`/auth/email-password/associate/start`, dto)
}

function confirmEmailPasswordAssociation(
    dto: ConfirmEmailPasswordAssociateDto,
): Promise<void | SendVerifyEmailAPIResponse> {
    return apiPost<void | SendVerifyEmailAPIResponse>('/auth/email-password/associate/confirm', dto).then(() => {
        return sendVerifyEmail()
    })
}

export const useAssociateEmailPassword = () => {
    return useMutation(associateEmailPassword)
}
