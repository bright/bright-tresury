import BN from 'bn.js'
import { BN_ZERO } from '@polkadot/util'
import { NetworkPlanckValue } from '../types'

const computeMedian = (networkPlanckValues: NetworkPlanckValue[]) => {
    const values = networkPlanckValues.map((value) => new BN(value)).sort((a, b) => a.cmp(b))
    const midIndex = Math.floor(values.length / 2)
    return (values.length
        ? values.length % 2
            ? values[midIndex]
            : values[midIndex - 1].add(values[midIndex]).divn(2)
        : BN_ZERO
    ).toString() as NetworkPlanckValue
}
export default computeMedian
