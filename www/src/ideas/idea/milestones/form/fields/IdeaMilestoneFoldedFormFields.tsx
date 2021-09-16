import React from 'react'
import Input from '../../../../../components/form/input/Input'
import { TextFieldColorScheme } from '../../../../../components/form/input/textFieldStyles'
import { useTranslation } from 'react-i18next'
import { useNetworks } from '../../../../../networks/useNetworks'
import { IdeaMilestoneFormValues } from '../IdeaMilestoneForm'
import { useIdeaMilestoneFormFieldsStyles } from './useIdeaMilestoneFormFieldsStyles'
import { IdeaMilestoneNetworkDto } from '../../idea.milestones.dto'
import { Network } from '../../../../../networks/networks.dto'
import Bond from '../../../../form/networks/Bond'
import NetworkInput from '../../../../form/networks/NetworkInput'
import { findIdeaMilestoneNetwork } from '../../idea.milestones.utils'

const translationKeyPrefix = 'idea.milestones.modal.form'

interface OwnProps {
    readonly: boolean
    values: IdeaMilestoneFormValues
}

export type IdeaMilestoneFoldedFormFieldsProps = OwnProps

const IdeaMilestoneFoldedFormFields = ({ values, readonly }: IdeaMilestoneFoldedFormFieldsProps) => {
    const classes = useIdeaMilestoneFormFieldsStyles()
    const { t } = useTranslation()
    const { network: currentNetwork } = useNetworks()

    // <Input name={`networks[0].value`} <- we use 0 because we want to display only 1 network which is the current network
    // please see IdeaMilestoneFormFields.tsx compareNetworks() for more details
    return (
        <div className={classes.root}>
            <Input
                name="beneficiary"
                label={t(`${translationKeyPrefix}.beneficiary`)}
                placeholder={t(`${translationKeyPrefix}.beneficiary`)}
                disabled={readonly}
                textFieldColorScheme={TextFieldColorScheme.Dark}
            />
            <NetworkInput
                inputName={`networks[0].value`}
                networkId={currentNetwork.id}
                value={values.networks[0].value}
                readonly={readonly}
            />
        </div>
    )
}

export default IdeaMilestoneFoldedFormFields
