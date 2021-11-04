import React from 'react'
import { useTranslation } from 'react-i18next'
import NetworkValueInput from '../../../components/form/input/networkValue/NetworkValueInput'
import NetworkValueInputContainer from '../../../components/form/input/networkValue/NetworkValueInputContainer'
import { ClassNameProps } from '../../../components/props/className.props'
import { useNetworks } from '../../../networks/useNetworks'
import BountyBond from './BountyBond'

interface OwnProps {
    blockchainDescription: string
    networkId?: string
}

export type BountyNetworkValueInputProps = OwnProps & ClassNameProps

const BountyNetworkValueInput = ({ blockchainDescription, networkId, className }: BountyNetworkValueInputProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()

    return (
        <NetworkValueInputContainer className={className}>
            <NetworkValueInput
                readonly={false}
                inputName={'value'}
                label={t('bounty.form.fields.value')}
                networkId={networkId ?? network.id}
            />
            <BountyBond blockchainDescription={blockchainDescription} networkId={networkId ?? network.id} />
        </NetworkValueInputContainer>
    )
}

export default BountyNetworkValueInput
