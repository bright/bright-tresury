import { NetworkPlanckValue } from '../../util/types'
import BN from 'bn.js'
import { BN_ZERO } from '@polkadot/util'
import { useMemo } from 'react'
import computeMedian from '../../util/median/medianUtil'

const useTipValue = (networkPlanckValues: NetworkPlanckValue[]) => {
    const median = useMemo(() => computeMedian(networkPlanckValues), [networkPlanckValues])
    return { median }
}
export default useTipValue
