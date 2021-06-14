import React from 'react'
import Input from '../../../../../components/form/input/Input'
import config from '../../../../../config'
import DatePickerInput from '../../../../../components/form/input/date/DatePickerInput'
import { Label } from '../../../../../components/text/Label'
import { FormGroup } from '@material-ui/core'
import { TextFieldColorScheme } from '../../../../../components/form/input/textFieldStyles'
import { useTranslation } from 'react-i18next'
import { IdeaMilestoneFormValues } from '../IdeaMilestoneForm'
import { useIdeaMilestoneFormFieldsStyles } from './useIdeaMilestoneFormFieldsStyles'

const translationKeyPrefix = 'idea.milestones.modal.form'

interface Props {
    values: IdeaMilestoneFormValues
    readonly: boolean
}

export const IdeaMilestoneFormFields = ({ values, readonly }: Props) => {
    const classes = useIdeaMilestoneFormFieldsStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.root}>
            <Input
                name="subject"
                label={t(`${translationKeyPrefix}.subject`)}
                placeholder={t(`${translationKeyPrefix}.yourMilestone`)}
                disabled={readonly}
                textFieldColorScheme={TextFieldColorScheme.Dark}
            />
            <Input
                name="beneficiary"
                label={t(`${translationKeyPrefix}.beneficiary`)}
                placeholder={t(`${translationKeyPrefix}.beneficiary`)}
                disabled={readonly}
                textFieldColorScheme={TextFieldColorScheme.Dark}
            />
            <FormGroup className={classes.narrowField}>
                <Label label={t(`${translationKeyPrefix}.date`)} />
                <div className={classes.dateRangeField}>
                    <DatePickerInput
                        name={'dateFrom'}
                        placeholder={t(`${translationKeyPrefix}.selectFrom`)}
                        disabled={readonly}
                        textFieldColorScheme={TextFieldColorScheme.Dark}
                    />
                    <DatePickerInput
                        name={'dateTo'}
                        placeholder={t(`${translationKeyPrefix}.selectTo`)}
                        disabled={readonly}
                        textFieldColorScheme={TextFieldColorScheme.Dark}
                    />
                </div>
            </FormGroup>
            {values.networks.map((network, idx) => {
                return (
                    <Input
                        name={`networks[${idx}].value`}
                        type={`number`}
                        label={t(`${translationKeyPrefix}.budget`)}
                        key={idx}
                        endAdornment={config.NETWORK_CURRENCY}
                        textFieldColorScheme={TextFieldColorScheme.Dark}
                        className={classes.narrowField}
                        disabled={readonly}
                    />
                )
            })}
            <Input
                name="description"
                label={t(`${translationKeyPrefix}.description`)}
                placeholder={t(`${translationKeyPrefix}.describeMilestone`)}
                disabled={readonly}
                rows={4}
                multiline={true}
                textFieldColorScheme={TextFieldColorScheme.Dark}
            />
        </div>
    )
}
