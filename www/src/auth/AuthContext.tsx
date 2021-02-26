import * as React from "react";
import {useState} from "react";
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
    email: string
    username: string
    web3Signup: boolean
    payload: any
}

const AuthContext = React.createContext<AuthContextState | undefined>(undefined)

const AuthContextProvider: React.FC = (props) => {
    const [user, setUser] = useState<AuthContextUser | undefined>()
    const [isUserSignedIn, setIsUserSignedIn] = useState(Session.doesSessionExist())

    const signOut = () => {
        return signOutApi().then(() => {
            setUser(undefined)
            setIsUserSignedIn(false)
        })
    }

    const signIn = (signInData: SignInData) => {
        return signInApi(signInData).then(async (result) => {
            if (result.status === 'OK') {
                const payload = await Session.getJWTPayloadSecurely()
                setUser({
                    username: result.user.id,
                    email: result.user.email,
                    web3Signup: false,
                    payload
                })
                setIsUserSignedIn(true)
            } else {
                console.log(result)
            }
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

