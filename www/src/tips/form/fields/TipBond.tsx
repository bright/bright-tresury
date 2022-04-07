import React from 'react'
import { useTranslation } from 'react-i18next'
import Bond from '../../../components/form/input/networkValue/Bond'
import { ClassNameProps } from '../../../components/props/className.props'
import { useNetworks } from '../../../networks/useNetworks'
import { NetworkPlanckValue } from '../../../util/types'
// import { calculateBondValue } from '../../tipBondUtil'

interface OwnProps {
    networkId: string
    blockchainDescription: string
}

export type TipBondProps = OwnProps & ClassNameProps

const TipBond = ({ networkId, blockchainDescription }: TipBondProps) => {
    const { t } = useTranslation()
    const { findNetwork } = useNetworks()
    const network = findNetwork(networkId)!

    const depositValue = '0' as NetworkPlanckValue
    // todo calculateBondValue(
    // blockchainDescription,
    // network.bounties.depositBase,
    // network.bounties.dataDepositPerByte,
    // )

    return (
        <Bond
            network={network}
            bondValue={depositValue}
            label={t('tip.form.fields.deposit')}
            tipLabel={t('tip.form.fields.depositTooltip')}
        />
    )
}

export default TipBond
