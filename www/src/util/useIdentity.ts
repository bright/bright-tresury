import { useEffect, useState } from 'react'
import { ApiState } from '../substrate-lib/api/SubstrateContext'
import { useSubstrate } from '../substrate-lib/api/useSubstrate'

import { DeriveAccountRegistration } from '@polkadot/api-derive/types'
import { Nil } from './types'

const useIdentity = ({ address }: { address: Nil<string> }) => {
    const [identity, setIdentity] = useState<DeriveAccountRegistration>()
    const { api, apiState } = useSubstrate()
    useEffect(() => {
        if (!api || apiState !== ApiState.READY) return
        if (!address) return
        api.derive.accounts.identity(address).then((fetchedIdentity) => setIdentity(fetchedIdentity))
    }, [api, apiState, address])

    return identity
}

export default useIdentity
