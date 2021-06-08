import React from 'react'
import { useField } from 'formik'
import { MuiPickersUtilsProvider, DatePicker as MaterialDatePicker } from '@material-ui/pickers'
import { Label } from '../../../text/Label'
import FormGroup from '@material-ui/core/FormGroup'
import DateFnsUtils from '@date-io/date-fns'
import { ErrorLabel } from '../ErrorLabel'
import { TextFieldColorScheme, useTextFieldStyles } from '../textFieldStyles'

interface Props {
    name: string
    label?: string | JSX.Element
    placeholder?: string
    disabled: boolean
    textFieldColorScheme?: TextFieldColorScheme
}

export const DatePickerInput = ({
    name,
    label,
    textFieldColorScheme = TextFieldColorScheme.Light,
    ...props
}: Props) => {
    const classes = useTextFieldStyles({ colorScheme: textFieldColorScheme })()

    const [field, meta, helpers] = useField(name)

    const hasError: boolean = meta.touched && Boolean(meta.error)

    return (
        <FormGroup>
            {label ? <Label label={label} /> : null}
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <MaterialDatePicker
                    {...props}
                    {...field}
                    {...meta}
                    autoOk
                    clearable
                    disableToolbar
                    error={hasError}
                    format={'yyyy-MM-dd'}
                    onChange={(date) => helpers.setValue(date)}
                    InputProps={{
                        classes: { ...classes },
                        disableUnderline: true,
                    }}
                />
            </MuiPickersUtilsProvider>
            <ErrorLabel touched={meta.touched} errorMessage={meta.error} />
        </FormGroup>
    )
}
