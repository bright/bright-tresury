import * as React from 'react'
import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import Session from 'supertokens-auth-react/lib/build/recipe/session/session'
import { encodeAddress } from '@polkadot/util-crypto'
import { useNetworks } from '../networks/useNetworks'
import { compareWeb3Address } from '../util/web3address.util'

export interface AuthContextState {
    user?: AuthContextUser
    isUserSignedIn: boolean
    isUserVerified: boolean
    isUserSignedInAndVerified: boolean
    hasWeb3AddressAssigned: (address: string) => boolean

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
    encodedAddress: string
}

export const AuthContext = React.createContext<AuthContextState | undefined>(undefined)

const AuthContextProvider = ({ children }: PropsWithChildren<{}>) => {
    const [user, setUser] = useState<AuthContextUser | undefined>()
    const [isUserSignedIn, setIsUserSignedIn] = useState(Session.doesSessionExist)
    const { network } = useNetworks()

    const refreshJwt = () => {
        if (isUserSignedIn) {
            Session.getJWTPayloadSecurely().then((payload: AuthContextUser) => {
                setUser({
                    ...payload,
                    isWeb3: payload.web3Addresses && payload.web3Addresses.length > 0,
                    isEmailPassword: !!payload.email,
                    web3Addresses: payload.web3Addresses.map((web3Address) => {
                        return {
                            ...web3Address,
                            encodedAddress: encodeAddress(web3Address.address, network.ss58Format),
                        }
                    }),
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

    const hasWeb3AddressAssigned = (address: string) =>
        !!user?.web3Addresses.find((web3Address) => compareWeb3Address(web3Address.address, address))

    return (
        <AuthContext.Provider
            value={{
                user,
                isUserSignedIn,
                isUserVerified,
                isUserSignedInAndVerified,
                setIsUserSignedIn,
                refreshJwt,
                hasWeb3AddressAssigned,
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
