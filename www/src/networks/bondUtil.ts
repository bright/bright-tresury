import { NetworkPlanckValue } from '../util/types'
import BN from 'bn.js'

export function calculateBondValue(
    networkValue: NetworkPlanckValue,
    bondPercent: number,
    bondMinValue: NetworkPlanckValue
): NetworkPlanckValue {
    const bondValue = new BN(networkValue).muln(bondPercent).divn(100)
    return BN.max(new BN(bondMinValue), bondValue).toString() as NetworkPlanckValue
}
