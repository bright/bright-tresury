import {SignUpAPIResponse} from 'supertokens-auth-react/lib/build/recipe/emailpassword/types';
import {fetchAndUnwrap} from '../api'

interface SignUpData {
    login: string
    password: string
    username: string
}

// TODO use API_URL once backend ready
const authApiPath = `http://localhost:3001/auth`

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

    return fetchAndUnwrap<SignUpAPIResponse>('POST', `${authApiPath}/signup`, requestData)
}
