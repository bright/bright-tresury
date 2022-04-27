import useTipValue from './useTipValue'
import { toNetworkDisplayValue } from '../../util/quota.util'
import { useNetworks } from '../../networks/useNetworks'
import NetworkValue from '../../components/network/NetworkValue'
import { TipDto } from '../tips.dto'

interface OwnProps {
    tip: TipDto
}

export type TipValueProps = OwnProps

const TipValue = ({ tip }: TipValueProps) => {
    const { network } = useNetworks()
    const { median } = useTipValue(tip)
    return <NetworkValue value={toNetworkDisplayValue(median, network.decimals)} />
}
export default TipValue
