import React from "react";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {breakpoints} from "../../../../theme/theme";
import {Input} from "../../../../components/form/input/Input";
import config from "../../../../config";
import {DatePickerInput} from "../../../../components/form/input/date/DatePickerInput";
import {Label} from "../../../../components/text/Label";
import {FormGroup} from "@material-ui/core";
import {TextFieldColorScheme} from "../../../../components/form/input/textFieldStyles";
import {useTranslation} from "react-i18next";
import {IdeaMilestoneFormValues} from "./IdeaMilestoneForm";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2em',
            marginTop: '1em',
        },
        narrowField: {
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
            },
        },
        dateRangeField: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
        }
    }),
);

const translationKeyPrefix = 'idea.milestones.modal.form'

interface Props {
    values: IdeaMilestoneFormValues
    readonly : boolean
}

export const IdeaMilestoneFormFields = ({ values, readonly }: Props) => {

    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.root}>
            <Input
                name="subject"
                label={t(`${translationKeyPrefix}.milestoneSubject`)}
                placeholder={t(`${translationKeyPrefix}.yourMilestone`)}
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
