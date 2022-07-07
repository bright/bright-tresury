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
        selectedNetwork.proposals.proposalBond,
        selectedNetwork.proposals.proposalBondMinimum,
        selectedNetwork.proposals.proposalBondMaximum,
        selectedNetwork.version,
    )

    const bondTooltipLabel = () => {
        if (bondValue === network.proposals.proposalBondMinimum) {
            return t('idea.details.form.networks.bond.min')
        } else if (network.proposals.proposalBondMaximum && bondValue === network.proposals.proposalBondMaximum) {
            return t('idea.details.form.networks.bond.max')
        } else {
            return (
                <Trans
                    i18nKey="idea.details.form.networks.bond.percentage"
                    values={{ percentage: network.proposals.proposalBond }}
                />
            )
        }
    }
    return (
        <Bond
            network={selectedNetwork}
            bondValue={bondValue}
            label={t('idea.details.form.networks.bond.name')}
            tipLabel={bondTooltipLabel()}
        />
    )
}

export default BountyBond
