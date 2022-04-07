import { ApiPromise } from '@polkadot/api'
import { DeriveAccountRegistration } from '@polkadot/api-derive/types'
import { ApiState, useSubstrate } from '../substrate-lib/api/SubstrateContext'
import { Nil } from './types'
import { useQuery } from 'react-query'

export const useIdentities = ({ addresses }: { addresses: string[] }) => {
    const { api, apiState } = useSubstrate()
    const { data: identities } = useQuery(['identities', api, apiState, addresses], async () => {
        if (!api || apiState !== ApiState.READY) return
        const map = new Map<string, Nil<DeriveAccountRegistration>>()
        await Promise.all(
            addresses.map(async (address) => {
                const identity = await api.derive.accounts.identity(address)
                return map.set(address, identity)
            }),
        )
        return map
    })
    return { identities }
}

export const getIdentity = (
    address: Nil<string>,
    api: Nil<ApiPromise>,
    apiState: Nil<ApiState>,
): Promise<DeriveAccountRegistration> | undefined => {
    if (!api || apiState !== ApiState.READY || !address) {
        return
    }
    return api.derive.accounts.identity(address)
}

const useIdentity = ({ address }: { address: Nil<string> }): { identity: Nil<DeriveAccountRegistration> } => {
    const { api, apiState } = useSubstrate()
    const { data: identity } = useQuery(['identity', api, apiState, address], () => {
        return getIdentity(address, api, apiState)
    })
    return { identity }
}

export default useIdentity
