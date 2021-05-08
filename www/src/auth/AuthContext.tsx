import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { SignInAPIResponse, SignUpAPIResponse } from 'supertokens-auth-react/lib/build/recipe/emailpassword/types'
import Session from 'supertokens-auth-react/lib/build/recipe/session/session'
import { signIn as signInApi, SignInData, signOut as signOutApi, SignUpData } from './auth.api'
import { Web3SignUpValues } from './sign-up/web3/Web3SignUp'
import { handleWeb3Signup, handleWeb3SignIn } from './sign-up/web3/handleWeb3Signup'

export interface AuthContextState {
    signUp?: (signUpData: SignUpData) => Promise<SignUpAPIResponse>
    signIn: (signInData: SignInData) => Promise<SignInAPIResponse>
    signOut: () => Promise<void>
    web3SignIn: (web3SignUpValues: Web3SignInValues) => Promise<void>
    web3SignUp: (web3SignUpValues: Web3SignUpValues) => Promise<void>
    user?: AuthContextUser
    isUserSignedIn: boolean
    isUserVerified: boolean
}

export interface AuthContextUser {
    id: string
    username: string
    email: string
    isEmailVerified: boolean
    isEmailPassword: boolean
    isWeb3: boolean
    web3Addresses: Web3Address[]
}

export interface Web3Address {
    address: string
    isPrimary: boolean
}

export const AuthContext = React.createContext<AuthContextState | undefined>(undefined)

const AuthContextProvider: React.FC = (props) => {
    const [user, setUser] = useState<AuthContextUser | undefined>()
    const [isUserSignedIn, setIsUserSignedIn] = useState(Session.doesSessionExist())

    useEffect(() => {
        if (isUserSignedIn) {
            Session.getJWTPayloadSecurely().then((payload: AuthContextUser) => {
                // TODO: get isWeb3 from backend
                setUser({
                    ...payload,
                })
            })
        } else {
            setUser(undefined)
        }
    }, [isUserSignedIn])

    const isUserVerified = useMemo(() => isUserSignedIn && !!user?.isEmailVerified, [isUserSignedIn, user])

    const signOut = () => {
        return signOutApi()
            .then(() => {
                setIsUserSignedIn(false)
            })
            .catch((error) => {
                console.log(error)
                setIsUserSignedIn(false)
            })
    }

    const signIn = (signInData: SignInData) => {
        return signInApi(signInData)
            .then((result: SignInAPIResponse) => {
                if (result.status === 'OK') {
                    setIsUserSignedIn(true)
                } else {
                    setIsUserSignedIn(false)
                    console.log(result)
                }
                return result
            })
            .catch((error) => {
                console.log(error)
                setIsUserSignedIn(false)
                throw error
            })
    }

    const web3SignUp = (web3SignUpValues: Web3SignUpValues) => {
        return handleWeb3Signup(web3SignUpValues.account)
            .then(() => {
                setIsUserSignedIn(true)
            })
            .catch((error) => {
                console.error(error)
                setIsUserSignedIn(false)
                throw error
            })
    }

    const web3SignIn = (web3SignInValues: Web3SignInValues) => {
        return handleWeb3SignIn(web3SignInValues.account)
            .then(() => {
                setIsUserSignedIn(true)
            })
            .catch((error) => {
                console.error(error)
                setIsUserSignedIn(false)
                throw error
            })
    }

    return (
        <AuthContext.Provider
            value={{ user, isUserSignedIn, isUserVerified, signIn, signOut, web3SignIn, web3SignUp }}
            {...props}
        />
    )
}

const useAuth = () => {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider')
    }

    return context
}

export { AuthContextProvider, useAuth }
