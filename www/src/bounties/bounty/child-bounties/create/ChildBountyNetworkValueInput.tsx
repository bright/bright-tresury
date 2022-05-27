import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNetworks } from '../../../../networks/useNetworks'
import NetworkValueInputContainer from '../../../../components/form/input/networkValue/NetworkValueInputContainer'
import NetworkValueInput from '../../../../components/form/input/networkValue/NetworkValueInput'
import { ClassNameProps } from '../../../../components/props/className.props'

interface OwnProps {
    networkId?: string
}

export type ChildBountyNetworkValueInputProps = OwnProps & ClassNameProps

const ChildBountyNetworkValueInput = ({ networkId, className }: ChildBountyNetworkValueInputProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()

    return (
        <NetworkValueInputContainer className={className}>
            <NetworkValueInput
                readonly={false}
                inputName={'value'}
                label={t('childBounty.form.fields.value')}
                networkId={networkId ?? network.id}
            />
        </NetworkValueInputContainer>
    )
}

export default ChildBountyNetworkValueInput
