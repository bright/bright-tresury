import {useMutation} from "react-query";
import {SignInAPIResponse} from 'supertokens-auth-react/lib/build/recipe/emailpassword/types';
import {apiPost} from "../../../api";
import {transformSignInRequestData} from '../../supertokens.utils/transformRequestData.utils';
import {SignInData} from "./emailSignIn.dto";

export function signIn(data: SignInData) {
    const requestData = transformSignInRequestData(data)
    return apiPost<SignInAPIResponse>(`/signin`, requestData).then((response) => {
        switch (response.status) {
            case "OK":
                return response
            case "FIELD_ERROR": // SuperTokens "FIELD_ERROR" when email is not a valid email string
            case "WRONG_CREDENTIALS_ERROR":
                throw new Error("WRONG_CREDENTIALS_ERROR")
        }
    })
}

export const useSignIn = () => {
    return useMutation(signIn)
}
