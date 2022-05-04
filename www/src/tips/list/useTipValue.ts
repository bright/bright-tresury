import { NetworkPlanckValue } from '../../util/types'
import { useMemo } from 'react'
import computeMedian from '../../util/median/medianUtil'
import { TipDto } from '../tips.dto'
import { useNetworks } from '../../networks/useNetworks'
import BN from 'bn.js'

export const useTipValue = (tip: TipDto) => {
    const { network } = useNetworks()

    const median = useMemo(() => computeMedian((tip.tips ?? []).map((t) => t.value)), [tip])
    const findersFee = useMemo(
        () => new BN(median).muln(network.tips.tipFindersFee).divn(100).toString() as NetworkPlanckValue,
        [median, tip],
    )
    const tipValue = useMemo(() => new BN(median).sub(new BN(findersFee)).toString() as NetworkPlanckValue, [
        median,
        findersFee,
    ])

    return { findersFee, tipValue, median }
}
export default useTipValue
