import { NetworkPlanckValue, Nil } from '../util/types'
import BN from 'bn.js'

export function calculateBondValue(
    networkValue: NetworkPlanckValue,
    bondPercent: number,
    bondMinValue: NetworkPlanckValue,
    bondMaxValue: Nil<NetworkPlanckValue>,
    version: number,
): NetworkPlanckValue {
    const percentage = new BN(networkValue).muln(bondPercent).divn(100)
    const percentageOrMin = BN.max(new BN(bondMinValue), percentage)

    return version >= 1600 && bondMaxValue !== undefined && bondMaxValue !== null
        ? (BN.min(percentageOrMin, new BN(bondMaxValue)).toString() as NetworkPlanckValue)
        : (percentageOrMin.toString() as NetworkPlanckValue)
}
