import * as React from "react";
import {useEffect, useState} from "react";
import Session from "supertokens-auth-react/lib/build/recipe/session/session";
import {signIn as signInApi, SignInData, signOut as signOutApi, SignUpData} from './auth.api'

interface AuthContextState {
    signUp?: (signUpData: SignUpData) => Promise<void>
    signIn: (signInData: SignInData) => Promise<void>
    signOut: () => Promise<void>
    user?: AuthContextUser
    isUserSignedIn: boolean
}

interface AuthContextUser {
    userId: string
    payload: string
}

const AuthContext = React.createContext<AuthContextState | undefined>(undefined)

const AuthContextProvider: React.FC = (props) => {
    const [user, setUser] = useState<AuthContextUser | undefined>()
    const [isUserSignedIn, setIsUserSignedIn] = useState(Session.doesSessionExist())

    useEffect(() => {
        if (isUserSignedIn) {
            const userId = Session.getUserId()
            Session.getJWTPayloadSecurely().then((payload) => {
                setUser({userId, payload})
            })
        } else {
            setUser(undefined)
        }
    }, [isUserSignedIn])

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
            .then((result) => {
                if (result.status === 'OK') {
                    setIsUserSignedIn(true)
                } else {
                    setIsUserSignedIn(false)
                    console.log(result)
                }
            })
            .catch((error) => {
                console.log(error)
                setIsUserSignedIn(false)
            })
    }

    return (
        <AuthContext.Provider value={{user, isUserSignedIn, signIn, signOut}} {...props}/>
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

