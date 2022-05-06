import BN from 'bn.js'
import { useBlockTime } from './useBlockTime'
import { extractTime } from '@polkadot/util'
import { useBestNumber } from './useBestNumber'
import { useMemo } from 'react'

export const useTimeLeft = (blockNumber: string) => {
    const { bestNumber } = useBestNumber()
    const { blockTime } = useBlockTime()

    const timeLeft = useMemo(() => {
        if (!bestNumber || !blockTime) return
        const blockNumberAsBN = new BN(blockNumber)
        const numberOfUsedBlocks = bestNumber.mod(blockNumberAsBN)
        const blocksLeft = blockNumberAsBN.sub(numberOfUsedBlocks!)
        const milliseconds = blocksLeft.mul(blockTime).toNumber()
        return extractTime(Math.abs(milliseconds))
    }, [bestNumber, blockNumber, blockTime])

    return { timeLeft }
}
