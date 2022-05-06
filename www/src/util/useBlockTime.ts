import { ApiState, useSubstrate } from '../substrate-lib/api/SubstrateContext'
import { useMemo } from 'react'
import BN from 'bn.js'
import { Nil } from './types'

const DEFAULT_TIME = new BN(6000) // 6s - Source: https://wiki.polkadot.network/docs/en/faq#what-is-the-block-time-of-the-relay-chain

export const useBlockTime = (): { blockTime: Nil<BN> } => {
    const { api, apiState } = useSubstrate()
    const blockTime = useMemo(() => {
        if (!api || apiState !== ApiState.READY) return
        const blockTimeStr =
            api?.consts.babe?.expectedBlockTime ||
            api?.consts.difficulty?.targetBlockTime ||
            api?.consts.timestamp?.minimumPeriod.muln(2) ||
            DEFAULT_TIME
        return new BN(blockTimeStr.toString())
    }, [api, apiState])

    return { blockTime }
}
