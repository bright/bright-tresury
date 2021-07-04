import React from 'react'
import Input from '../../../../../components/form/input/Input'
import { TextFieldColorScheme } from '../../../../../components/form/input/textFieldStyles'
import { useTranslation } from 'react-i18next'
import { useNetworks } from '../../../../../networks/useNetworks'
import { IdeaMilestoneFormValues } from '../IdeaMilestoneForm'
import { useIdeaMilestoneFormFieldsStyles } from './useIdeaMilestoneFormFieldsStyles'

const translationKeyPrefix = 'idea.milestones.modal.form'

interface OwnProps {
    values: IdeaMilestoneFormValues
    readonly: boolean
}

export type IdeaMilestoneFoldedFormFieldsProps = OwnProps

const IdeaMilestoneFoldedFormFields = ({ values, readonly }: IdeaMilestoneFoldedFormFieldsProps) => {
    const classes = useIdeaMilestoneFormFieldsStyles()
    const { t } = useTranslation()
    const {
        network: { currency },
    } = useNetworks()

    return (
        <div className={classes.root}>
            <Input
                name="beneficiary"
                label={t(`${translationKeyPrefix}.beneficiary`)}
                placeholder={t(`${translationKeyPrefix}.beneficiary`)}
                disabled={readonly}
                textFieldColorScheme={TextFieldColorScheme.Dark}
            />
            {values.networks.map((network, idx) => {
                return (
                    <Input
                        name={`networks[${idx}].value`}
                        type={`number`}
                        label={t(`${translationKeyPrefix}.budget`)}
                        key={idx}
                        endAdornment={currency}
                        textFieldColorScheme={TextFieldColorScheme.Dark}
                        className={classes.narrowField}
                        disabled={readonly}
                    />
                )
            })}
        </div>
    )
}

export default IdeaMilestoneFoldedFormFields
