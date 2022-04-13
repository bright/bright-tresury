import { NetworkPlanckValue } from '../../util/types'
import useTipValue from './useTipValue'
import { toNetworkDisplayValue } from '../../util/quota.util'
import { useNetworks } from '../../networks/useNetworks'
import NetworkValue from '../../components/network/NetworkValue'

interface OwnProps {
    tipsValues: NetworkPlanckValue[]
}

export type TipValueProps = OwnProps

const TipValue = ({ tipsValues }: TipValueProps) => {
    const { network } = useNetworks()
    const { median } = useTipValue(tipsValues)
    return <NetworkValue value={toNetworkDisplayValue(median, network.decimals)} />
}
export default TipValue
