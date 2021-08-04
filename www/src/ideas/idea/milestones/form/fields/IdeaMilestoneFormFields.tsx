import React from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../../../components/form/input/Input'
import { TextFieldColorScheme } from '../../../../../components/form/input/textFieldStyles'
import DateRangeInput from '../../../../../milestone-details/components/form/DateRangeInput'
import DescriptionInput from '../../../../../milestone-details/components/form/DescriptionInput'
import SubjectInput from '../../../../../milestone-details/components/form/SubjectInput'
import { useNetworks } from '../../../../../networks/useNetworks'
import { IdeaMilestoneFormValues } from '../IdeaMilestoneForm'
import { useIdeaMilestoneFormFieldsStyles } from './useIdeaMilestoneFormFieldsStyles'

const translationKeyPrefix = 'idea.milestones.modal.form'

interface OwnProps {
    values: IdeaMilestoneFormValues
    readonly: boolean
}

export type IdeaMilestoneFormFieldsProps = OwnProps

const IdeaMilestoneFormFields = ({ values, readonly }: IdeaMilestoneFormFieldsProps) => {
    const classes = useIdeaMilestoneFormFieldsStyles()
    const { t } = useTranslation()
    const {
        network: { currency },
    } = useNetworks()

    return (
        <div className={classes.root}>
            <SubjectInput readonly={readonly} />
            <Input
                name="beneficiary"
                label={t(`${translationKeyPrefix}.beneficiary`)}
                placeholder={t(`${translationKeyPrefix}.beneficiary`)}
                disabled={readonly}
                textFieldColorScheme={TextFieldColorScheme.Dark}
            />
            <DateRangeInput readonly={readonly} />
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
            <DescriptionInput readonly={readonly} />
        </div>
    )
}

export default IdeaMilestoneFormFields
