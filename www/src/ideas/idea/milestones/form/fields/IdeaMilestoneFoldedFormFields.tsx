import React from "react";
import {Input} from "../../../../../components/form/input/Input";
import config from "../../../../../config";
import {TextFieldColorScheme} from "../../../../../components/form/input/textFieldStyles";
import {useTranslation} from "react-i18next";
import {IdeaMilestoneFormValues} from "../IdeaMilestoneForm";
import { useIdeaMilestoneFormFieldsStyles } from './useIdeaMilestoneFormFieldsStyles'

const translationKeyPrefix = 'idea.milestones.modal.form'

interface Props {
    values: IdeaMilestoneFormValues
    readonly : boolean
}

export const IdeaMilestoneFoldedFormFields = ({ values, readonly }: Props) => {

    const classes = useIdeaMilestoneFormFieldsStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.root}>
            <Input
                name="beneficiary"
                label={t(`${translationKeyPrefix}.beneficiary`)}
                placeholder={t(`${translationKeyPrefix}.beneficiary`)}
                disabled={readonly}
                textFieldColorScheme={TextFieldColorScheme.Dark}
            />
            {
                values.networks.map((network, idx) => {
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
                }
            )}
        </div>
    )
}
