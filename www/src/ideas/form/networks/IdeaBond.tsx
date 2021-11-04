import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Bond from '../../../components/form/input/networkValue/Bond'
import { ClassNameProps } from '../../../components/props/className.props'
import { useNetworks } from '../../../networks/useNetworks'
import { toNetworkPlanckValue } from '../../../util/quota.util'
import { NetworkDisplayValue } from '../../../util/types'
import { calculateBondValue } from '../../bondUtil'

interface OwnProps {
    networkId?: string
    value: NetworkDisplayValue
}

export type BountyBondProps = OwnProps & ClassNameProps

const BountyBond = ({ networkId, value }: BountyBondProps) => {
    const { t } = useTranslation()
    const { findNetwork, network } = useNetworks()
    const selectedNetwork = networkId ? findNetwork(networkId) ?? network : network

    const bondValue = calculateBondValue(
        toNetworkPlanckValue(value, selectedNetwork.decimals)!,
        selectedNetwork.bond.percentage,
        selectedNetwork.bond.minValue,
    )

    const bondTooltipLabel =
        bondValue === network.bond.minValue ? (
            t('idea.details.form.networks.bond.min')
        ) : (
            <Trans
                i18nKey="idea.details.form.networks.bond.percentage"
                values={{ percentage: network.bond.percentage }}
            />
        )

    return (
        <Bond
            network={selectedNetwork}
            bondValue={bondValue}
            label={t('idea.details.form.networks.bond.name')}
            tipLabel={bondTooltipLabel}
        />
    )
}

export default BountyBond
