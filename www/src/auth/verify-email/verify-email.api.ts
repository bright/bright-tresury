import {useMutation} from "react-query";
import {SendVerifyEmailAPIResponse} from "supertokens-auth-react/lib/build/recipe/emailverification/types";
import { apiPost } from "../../api";

function sendVerifyEmail() {
    return apiPost<SendVerifyEmailAPIResponse>('/user/email/verify/token')
}

function verifyEmail(token: string) {
    return apiPost<void>(`/auth/email-password/verify/${token}`)
}

export const useVerifyEmail = () => {
    return useMutation(verifyEmail)
}

export const useSendVerifyEmail = () => {
    return useMutation(sendVerifyEmail)
}
