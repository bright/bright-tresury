import BN from 'bn.js'
import { NetworkPlanckValue } from '../util/types'

export function calculateBondValue(
    onChainDesc: string,
    depositBase: NetworkPlanckValue,
    depositPerByte: NetworkPlanckValue,
): NetworkPlanckValue {
    const descLength = new BN(new Blob([onChainDesc]).size)
    const depositForDesc = new BN(depositPerByte).mul(descLength)
    const bondValue = new BN(depositBase).add(depositForDesc)
    return bondValue.toString() as NetworkPlanckValue
}
