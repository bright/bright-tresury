import { ApiState, useSubstrate } from '../substrate-lib/api/SubstrateContext'
import { Nil } from './types'
import { useEffect, useState } from 'react'
import BN from 'bn.js'

interface Balances {
    total?: BN
    transferable?: BN
    locked?: BN
    reserved?: BN
    bonded?: BN
}
const useBalances = ({ address }: { address: Nil<string> }) => {
    const { api, apiState } = useSubstrate()
    const [balances, setBalances] = useState<Balances>({})
    useEffect(() => {
        if (!api || apiState !== ApiState.READY) return
        if (!address) return
        api.derive.balances.all(address).then((data) => {
            const total = data.freeBalance.add(data.reservedBalance)
            const transferable = data.availableBalance.toBn()
            const locked = data.lockedBalance.toBn()
            const reserved = data.reservedBalance.toBn()
            setBalances({ total, transferable, locked, reserved })
        })
    }, [api, apiState])
    return { balances }
}

export default useBalances
