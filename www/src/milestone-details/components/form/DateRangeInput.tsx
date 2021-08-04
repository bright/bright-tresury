import { FormGroup } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import DatePickerInput from '../../../components/form/input/date/DatePickerInput'
import { TextFieldColorScheme } from '../../../components/form/input/textFieldStyles'
import { Label } from '../../../components/text/Label'
import { breakpoints } from '../../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
        },
    }),
)

interface OwnProps {
    readonly: boolean
}

export type DateRangeInputProps = OwnProps

const DateRangeInput = ({ readonly }: DateRangeInputProps) => {
    const { t } = useTranslation()
    const classes = useStyles()

    return (
        <FormGroup className={classes.narrowField}>
            <Label label={t(`milestoneDetails.form.date`)} />
            <div className={classes.dateRangeField}>
                <DatePickerInput
                    name={'dateFrom'}
                    placeholder={t(`milestoneDetails.form.selectFrom`)}
                    disabled={readonly}
                    textFieldColorScheme={TextFieldColorScheme.Dark}
                />
                <DatePickerInput
                    name={'dateTo'}
                    placeholder={t(`milestoneDetails.form.selectTo`)}
                    disabled={readonly}
                    textFieldColorScheme={TextFieldColorScheme.Dark}
                />
            </div>
        </FormGroup>
    )
}

export default DateRangeInput
