import {SignInAPIResponse, SignUpAPIResponse} from 'supertokens-auth-react/lib/build/recipe/emailpassword/types';
import api from '../api';

export interface SignUpData {
    login: string
    password: string
    username: string
}

export interface SignInData {
    login: string
    password: string
}

// TODO use API_URL once backend ready
const authApiPath = `http://localhost:3001/api`

export function signUp(data: SignUpData) {
    const {login, password, username} = data;
    const requestData = {
        formFields: [
            {
                id: 'email',
                value: login,
            },
            {
                id: 'password',
                value: password,
            },
            {
                id: 'username',
                value: username,
            }
        ],
    };

    return api.post<SignUpAPIResponse>( `${authApiPath}/signup`, requestData).then((response) => response.data)
}

export function signIn(data: SignInData) {
    const {login, password} = data;
    const requestData = {
        formFields: [
            {
                id: 'email',
                value: login,
            },
            {
                id: 'password',
                value: password,
            },
        ],
    };

    return api.post<SignInAPIResponse>(`${authApiPath}/signin`, requestData).then((response) => response.data)
}

export function signOut() {
    return api.post<SignInAPIResponse>(`${authApiPath}/signout`).then((response) => response.data)
}
