import {SignInAPIResponse, SignUpAPIResponse} from 'supertokens-auth-react/lib/build/recipe/emailpassword/types';
import {apiPost} from "../api";
import {transformSignInRequestData, transformSignUpRequestData} from "./supertokens.utils";

export interface SignUpData {
    email: string
    password: string
    username: string
}

export interface SignInData {
    email: string
    password: string
}

// TODO use API_URL once backend ready
const authApiPath = `http://localhost:3001/api`

export function signUp(data: SignUpData) {
    const requestData = transformSignUpRequestData(data)
    return apiPost<SignUpAPIResponse>( `${authApiPath}/signup`, requestData)
}

export function signIn(data: SignInData) {
    const requestData = transformSignInRequestData(data)
    return apiPost<SignInAPIResponse>(`${authApiPath}/signin`, requestData)
}

export function signOut() {
    return apiPost(`${authApiPath}/signout`)
}
