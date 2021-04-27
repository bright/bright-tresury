import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {SignInAPIResponse, SignUpAPIResponse} from "supertokens-auth-react/lib/build/recipe/emailpassword/types";
import Session from "supertokens-auth-react/lib/build/recipe/session/session";
import {signIn as signInApi, SignInData, signOut as signOutApi, SignUpData} from './auth.api'

interface AuthContextState {
    signUp?: (signUpData: SignUpData) => Promise<SignUpAPIResponse>
    signIn: (signInData: SignInData) => Promise<SignInAPIResponse>
    signOut: () => Promise<void>
    user?: AuthContextUser
    isUserSignedIn: boolean
    isUserVerified: boolean
}

interface AuthContextUser {
    id: string
    username: string
    email: string
    isEmailVerified: boolean
}

const AuthContext = React.createContext<AuthContextState | undefined>(undefined)

const AuthContextProvider: React.FC = (props) => {
    const [user, setUser] = useState<AuthContextUser | undefined>()
    const [isUserSignedIn, setIsUserSignedIn] = useState(Session.doesSessionExist())

    useEffect(() => {
        if (isUserSignedIn) {
            Session.getJWTPayloadSecurely().then((payload: AuthContextUser) => {
                setUser(payload)
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

    return (
        <AuthContext.Provider value={{user, isUserSignedIn, isUserVerified, signIn, signOut}} {...props}/>
    )
}

const useAuth = () => {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider")
    }

    return context
}

export {AuthContextProvider, useAuth}

