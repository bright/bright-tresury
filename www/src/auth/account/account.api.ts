import {SignUpAPIResponse} from "supertokens-auth-react/lib/build/recipe/emailpassword/types";
import {SendVerifyEmailAPIResponse} from "supertokens-auth-react/lib/build/recipe/emailverification/types";
import {apiPost} from "../../api";
import {sendVerifyEmail, SignUpData} from "../auth.api";
import {transformSignUpRequestData} from "../supertokens.utils/transformRequestData.utils";

export function addEmailPassword(data: SignUpData) {
    /*
    TODO use other api endpoint to update email password data
     */
    const requestData = transformSignUpRequestData(data)

    return apiPost<SignUpAPIResponse | SendVerifyEmailAPIResponse>( `/signup`, requestData).then((result) => {
        if (result.status === "OK") {
            return sendVerifyEmail()
        } else {
            return result
        }
    })
}
