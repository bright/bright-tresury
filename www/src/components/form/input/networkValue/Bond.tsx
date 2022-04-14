import React, { ReactNode } from 'react'
import { ClassNameProps } from '../../../../components/props/className.props'
import { Network } from '../../../../networks/networks.dto'
import { toNetworkDisplayValue } from '../../../../util/quota.util'
import { NetworkPlanckValue } from '../../../../util/types'
import NetworkValueInput from './NetworkValueInput'

interface OwnProps {
    network: Network
    bondValue: NetworkPlanckValue
    tipLabel: ReactNode
    label: string
}

export type BondProps = OwnProps & ClassNameProps

const Bond = ({ network, bondValue, tipLabel, label, className }: BondProps) => {
    return (
        <NetworkValueInput
            className={className}
            label={label}
            networkId={network.id}
            readonly={true}
            value={toNetworkDisplayValue(bondValue, network.decimals)}
            tipLabel={tipLabel}
        />
    )
}

export default Bond
