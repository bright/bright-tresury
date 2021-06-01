import {useMutation} from "react-query";
import {SignUpAPIResponse} from 'supertokens-auth-react/lib/build/recipe/emailpassword/types';
import {SendVerifyEmailAPIResponse} from "supertokens-auth-react/lib/build/recipe/emailverification/types";
import {apiPost} from "../../../api";
import {sendVerifyEmail} from '../../auth.api';
import {transformSignUpRequestData} from '../../supertokens.utils/transformRequestData.utils';
import {FieldError, SignUpData} from "./sign-up-email.dto";

async function signUp(data: SignUpData) {
    const requestData = transformSignUpRequestData(data)

    return apiPost<SignUpAPIResponse | SendVerifyEmailAPIResponse>( `/signup`, requestData).then((response) => {
        switch (response.status) {
            case "OK":
                return sendVerifyEmail()
            case "FIELD_ERROR":
                throw new FieldError(response.formFields)
        }
    })
}

export const useSignUp = () => {
    return useMutation(signUp)
}
