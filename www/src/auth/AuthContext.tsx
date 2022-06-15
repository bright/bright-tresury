import * as React from 'react'
import { PropsWithChildren, useCallback, useEffect, useMemo } from 'react'
import { encodeAddress } from '@polkadot/util-crypto'
import { useNetworks } from '../networks/useNetworks'
import { compareWeb3Address } from '../util/web3address.util'
import Session, { signOut, useSessionContext } from 'supertokens-auth-react/recipe/session'
import { Nil } from '../util/types'

export interface AuthContextState {
    user?: AuthContextUser
    isUserSignedIn: boolean
    isUserVerified: boolean
    isUserSignedInAndVerified: boolean
    hasWeb3AddressAssigned: (address: Nil<string>) => boolean

    refreshSession: () => Promise<void>
    signOut: () => void
}

export interface AuthContextUser {
    id: string
    username: string
    email: string
    isEmailVerified: boolean
    status: UserStatus
    isWeb3: boolean
    web3Addresses: Web3Address[]
}

export interface Web3Address {
    address: string
    isPrimary: boolean
    encodedAddress: string
}

export enum UserStatus {
    EmailPasswordEnabled = 'emailPasswordEnabled',
    Web3Only = 'web3Only',
    Deleted = 'deleted',
}

export const AuthContext = React.createContext<AuthContextState | undefined>(undefined)

const AuthContextProvider = ({ children }: PropsWithChildren<{}>) => {
    const { network } = useNetworks()
    const { accessTokenPayload, doesSessionExist } = useSessionContext()

    const user: AuthContextUser | undefined = useMemo(
        () =>
            doesSessionExist
                ? {
                      ...accessTokenPayload,
                      isWeb3: accessTokenPayload.web3Addresses && accessTokenPayload.web3Addresses.length > 0,
                      isEmailPassword: !!accessTokenPayload.email,
                      web3Addresses:
                          accessTokenPayload.web3Addresses?.map((web3Address: any) => {
                              return {
                                  ...web3Address,
                                  encodedAddress: encodeAddress(web3Address.address, network.ss58Format),
                              }
                          }) ?? [],
                  }
                : undefined,
        [doesSessionExist, accessTokenPayload, network.ss58Format],
    )

    const isUserVerified = useMemo(
        () =>
            user !== undefined &&
            (user.isWeb3 || (user.status === UserStatus.EmailPasswordEnabled && user.isEmailVerified)),
        [user],
    )

    const isUserSignedInAndVerified = useMemo(
        () =>
            doesSessionExist &&
            user !== undefined &&
            (user.isWeb3 || (user.status === UserStatus.EmailPasswordEnabled && user.isEmailVerified)),
        [user, doesSessionExist],
    )

    const hasWeb3AddressAssigned = useCallback(
        (address: Nil<string>) =>
            !!address &&
            !!user?.web3Addresses.find((web3Address: any) => compareWeb3Address(web3Address.address, address)),
        [user],
    )

    useEffect(() => {
        if (doesSessionExist) {
            refreshSession()
        }
    }, [doesSessionExist])

    const refreshSession = async () => {
        await Session.attemptRefreshingSession()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isUserSignedIn: doesSessionExist,
                isUserVerified,
                isUserSignedInAndVerified,
                signOut,
                refreshSession,
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
