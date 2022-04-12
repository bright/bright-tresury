import React from 'react'
import { useTranslation } from 'react-i18next'
import Bond from '../../../components/form/input/networkValue/Bond'
import { ClassNameProps } from '../../../components/props/className.props'
import { useNetworks } from '../../../networks/useNetworks'
import { calculateBondValue } from '../../../util/tips-bounties-bond/bondUtil'

interface OwnProps {
    networkId: string
    blockchainDescription: string
}

export type BountyBondProps = OwnProps & ClassNameProps

const BountyBond = ({ networkId, blockchainDescription }: BountyBondProps) => {
    const { t } = useTranslation()
    const { findNetwork } = useNetworks()
    const network = findNetwork(networkId)!

    const depositValue = calculateBondValue(
        blockchainDescription,
        network.bounties.depositBase,
        network.bounties.dataDepositPerByte,
    )

    return (
        <Bond
            network={network}
            bondValue={depositValue}
            label={t('bounty.form.fields.deposit')}
            tipLabel={t('bounty.form.fields.depositTooltip')}
        />
    )
}

export default BountyBond
