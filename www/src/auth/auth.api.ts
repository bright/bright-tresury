import {SignInAPIResponse, SignUpAPIResponse} from 'supertokens-auth-react/lib/build/recipe/emailpassword/types';
import {API_URL, apiPost} from "../api";
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

export function signUp(data: SignUpData) {
    const requestData = transformSignUpRequestData(data)
    return apiPost<SignUpAPIResponse>( `${API_URL}/signup`, requestData)
}

export function signIn(data: SignInData) {
    const requestData = transformSignInRequestData(data)
    return apiPost<SignInAPIResponse>(`${API_URL}/signin`, requestData)
}

export function signOut() {
    return apiPost(`${API_URL}/signout`)
}
