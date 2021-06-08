import * as React from 'react'
import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import Session from 'supertokens-auth-react/lib/build/recipe/session/session'

export interface AuthContextState {
    user?: AuthContextUser
    isUserSignedIn: boolean
    isUserVerified: boolean
    isUserSignedInAndVerified: boolean

    setIsUserSignedIn: (isUserSignedIn: boolean) => void
    refreshJwt: () => void
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

const AuthContextProvider = ({ children }: PropsWithChildren<{}>) => {
    const [user, setUser] = useState<AuthContextUser | undefined>()
    const [isUserSignedIn, setIsUserSignedIn] = useState(Session.doesSessionExist)

    const refreshJwt = () => {
        if (isUserSignedIn) {
            Session.getJWTPayloadSecurely().then((payload: AuthContextUser) => {
                setUser({
                    ...payload,
                    isWeb3: payload.web3Addresses && payload.web3Addresses.length > 0,
                    isEmailPassword: !!payload.email,
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

    const isUserSignedInAndVerified = useMemo(() => isUserSignedIn && isUserVerified, [isUserSignedIn, isUserVerified])

    return (
        <AuthContext.Provider
            value={{
                user,
                isUserSignedIn,
                isUserVerified,
                isUserSignedInAndVerified,
                setIsUserSignedIn,
                refreshJwt,
            }}
            children={children}
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
