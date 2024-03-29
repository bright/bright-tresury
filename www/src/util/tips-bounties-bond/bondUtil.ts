import BN from 'bn.js'
import { getBytesLength } from '../stringUtil'
import { NetworkPlanckValue } from '../types'

export function calculateBondValue(
    onChainDesc: string,
    depositBase: NetworkPlanckValue,
    depositPerByte: NetworkPlanckValue,
): NetworkPlanckValue {
    const descLength = new BN(getBytesLength(onChainDesc))
    const depositForDesc = new BN(depositPerByte).mul(descLength)
    const bondValue = new BN(depositBase).add(depositForDesc)
    return bondValue.toString() as NetworkPlanckValue
}
