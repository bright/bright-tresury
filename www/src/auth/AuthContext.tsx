import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { SignInAPIResponse, SignUpAPIResponse } from 'supertokens-auth-react/lib/build/recipe/emailpassword/types'
import Session from 'supertokens-auth-react/lib/build/recipe/session/session'
import { signIn as signInApi, SignInData, signOut as signOutApi, SignUpData } from './auth.api'
import { Web3SignUpValues } from './sign-up/web3/Web3SignUp'
import { Web3SignInValues } from './sign-in/web3/Web3SignIn'
import { handleAssociateWeb3Account, handleWeb3SignIn, handleWeb3SignUp } from './handleWeb3Sign'
import { Web3AssociateValues } from './account/web3/Web3AccountForm'

export interface AuthContextState {
    signUp?: (signUpData: SignUpData) => Promise<SignUpAPIResponse>
    signIn: (signInData: SignInData) => Promise<SignInAPIResponse>
    signOut: () => Promise<void>
    web3SignIn: (web3SignUpValues: Web3SignInValues) => Promise<void>
    web3SignUp: (web3SignUpValues: Web3SignUpValues) => Promise<void>
    web3Associate: (web3AssociateValues: Web3AssociateValues) => Promise<void>
    user?: AuthContextUser
    isUserSignedIn: boolean
    isUserVerified: boolean
    isUserSignedInAndVerified: boolean
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
    const [isUserSignedIn, setIsUserSignedIn] = useState(Session.doesSessionExist)

    const refreshJwt = () => {
        if (isUserSignedIn) {
            Session.getJWTPayloadSecurely().then((payload: AuthContextUser) => {
                setUser({
                    ...payload,
                    isWeb3: payload.web3Addresses && payload.web3Addresses.length > 0,
                })
            })
        } else {
            setUser(undefined)
        }
    }

    useEffect(() => {
        refreshJwt()
    }, [isUserSignedIn])

    const isUserVerified = useMemo(
        () => user !== undefined && (user.isWeb3 || (user.isEmailPassword && user.isEmailVerified)),
        [user],
    )

    const isUserSignedInAndVerified = useMemo(() => {
        return isUserSignedIn && isUserVerified
    }, [isUserSignedIn, isUserVerified])

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
        return handleWeb3SignUp(web3SignUpValues.account)
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

    const web3Associate = (web3SignInValues: Web3SignInValues) => {
        return handleAssociateWeb3Account(web3SignInValues.account)
            .then(() => {
                refreshJwt()
            })
            .catch((error) => {
                console.error(error)
                throw error
            })
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isUserSignedIn,
                isUserVerified,
                isUserSignedInAndVerified,
                signIn,
                signOut,
                web3SignIn,
                web3SignUp,
                web3Associate
            }}
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
