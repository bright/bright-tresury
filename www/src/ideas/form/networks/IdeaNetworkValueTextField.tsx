import React from 'react'
import { useTranslation } from 'react-i18next'
import NetworkValueInput from '../../../components/form/input/networkValue/NetworkValueInput'
import NetworkValueInputContainer from '../../../components/form/input/networkValue/NetworkValueInputContainer'
import { ClassNameProps } from '../../../components/props/className.props'
import { NetworkDisplayValue } from '../../../util/types'
import IdeaBond from './IdeaBond'

interface OwnProps {
    value: NetworkDisplayValue
    networkId: string
}

export type IdeaNetworkValueTextFieldProps = OwnProps & ClassNameProps

const IdeaNetworkValueTextField = ({ value, networkId, className }: IdeaNetworkValueTextFieldProps) => {
    const { t } = useTranslation()

    return (
        <NetworkValueInputContainer className={className}>
            <NetworkValueInput
                value={value}
                readonly={true}
                networkId={networkId}
                label={t('idea.details.form.networks.reward')}
            />
            <IdeaBond value={value} networkId={networkId} />
        </NetworkValueInputContainer>
    )
}

export default IdeaNetworkValueTextField
