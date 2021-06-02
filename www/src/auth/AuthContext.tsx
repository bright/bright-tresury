import * as React from 'react'
import {PropsWithChildren, useEffect, useMemo, useState} from 'react'
import Session from 'supertokens-auth-react/lib/build/recipe/session/session'
import {makePrimary, unlinkAddress} from './account/web3/web3.api'
import {Web3AssociateValues} from './account/web3/Web3AccountForm'
import {handleAssociateWeb3Account, handleWeb3SignIn} from './handleWeb3Sign'
import {Web3SignInValues} from './sign-in/web3/Web3SignIn'

export interface AuthContextState {
    web3SignIn: (web3SignUpValues: Web3SignInValues) => Promise<void>
    web3Associate: (web3AssociateValues: Web3AssociateValues) => Promise<void>
    web3Unlink: (address: string) => Promise<void>
    web3MakePrimary: (address: string) => Promise<void>

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

const AuthContextProvider = ({children}: PropsWithChildren<{}>) => {
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

    const callWithRefreshToken = (call: Promise<any>) => {
        return call
            .then(() => {
                return refreshJwt()
            })
            .catch((error) => {
                console.error(error)
                throw error
            })
    }

    const callWithSetSignedIn = (call: Promise<any>) => {
        return call
            .then((result: any) => {
                setIsUserSignedIn(true)
            })
            .catch((error) => {
                console.error(error)
                setIsUserSignedIn(false)
                throw error
            })
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

    const web3SignIn = (web3SignInValues: Web3SignInValues) =>
        callWithSetSignedIn(handleWeb3SignIn(web3SignInValues.account))

    const web3Associate = (web3AssociateValues: Web3AssociateValues) =>
        callWithRefreshToken(handleAssociateWeb3Account(web3AssociateValues))

    const web3Unlink = (address: string) => callWithRefreshToken(unlinkAddress(address))

    const web3MakePrimary = (address: string) => callWithRefreshToken(makePrimary(address))

    return (
        <AuthContext.Provider
            value={{
                user,
                isUserSignedIn,
                isUserVerified,
                isUserSignedInAndVerified,
                web3SignIn,
                web3Associate,
                web3Unlink,
                web3MakePrimary,
                setIsUserSignedIn,
                refreshJwt
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
