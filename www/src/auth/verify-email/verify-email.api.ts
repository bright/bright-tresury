import {useMutation} from "react-query";
import {SendVerifyEmailAPIResponse} from "supertokens-auth-react/lib/build/recipe/emailverification/types";
import {apiPost} from "../../api";

export function sendVerifyEmail() {
    return apiPost<SendVerifyEmailAPIResponse>('/user/email/verify/token').then((response) => {
        switch (response.status) {
            case "OK":
                return response
            case "EMAIL_ALREADY_VERIFIED_ERROR":
                throw new Error("EMAIL_ALREADY_VERIFIED_ERROR")
        }
    })
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
