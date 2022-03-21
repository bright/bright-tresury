import { ApiState, useSubstrate } from '../substrate-lib/api/SubstrateContext'
import { Nil } from './types'
import { useQuery } from 'react-query'

const useIdentity = ({ address }: { address: Nil<string> }) => {
    const { api, apiState } = useSubstrate()
    const { data: identity } = useQuery(['identity', api, apiState, address], () => {
        if (!api || apiState !== ApiState.READY) return
        if (!address) return
        return api.derive.accounts.identity(address)
    })
    return { identity }
}

export default useIdentity
