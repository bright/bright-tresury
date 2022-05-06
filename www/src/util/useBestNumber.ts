import { ApiState, useSubstrate } from '../substrate-lib/api/SubstrateContext'
import { useEffect, useState } from 'react'
import { BlockNumber } from '@polkadot/types/interfaces'

export const useBestNumber = () => {
    const { api, apiState } = useSubstrate()
    const [bestNumber, setBestNumber] = useState<BlockNumber>()

    useEffect(() => {
        if (!api || apiState !== ApiState.READY) return
        api?.derive.chain.bestNumber().then((bestNumber) => setBestNumber(bestNumber))
    }, [api, apiState])
    return { bestNumber }
}
