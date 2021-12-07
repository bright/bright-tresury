import FormGroup from '@material-ui/core/FormGroup'
import { FieldHookConfig, useField } from 'formik'
import React from 'react'
import { Nil } from '../../../util/types'
import { Label } from '../../text/Label'
import ErrorLabel from './ErrorLabel'
import TextField, { TextFieldProps } from './TextField'
import { TextFieldColorScheme } from './textFieldStyles'

interface OwnProps {
    label?: string | JSX.Element
    description?: Nil<string>
    endAdornment?: string
    textFieldColorScheme?: TextFieldColorScheme
}

export type InputProps = OwnProps & Omit<TextFieldProps, 'label'> & FieldHookConfig<string>

const Input = ({
    label,
    description,
    endAdornment,
    name = '',
    textFieldColorScheme = TextFieldColorScheme.Light,
    className,
    ...props
}: InputProps) => {
    const [field, meta] = useField(name)
    const hasError: boolean = meta.touched && Boolean(meta.error)

    return (
        <FormGroup className={className}>
            {label ? <Label label={label} description={description} /> : null}
            <TextField
                {...props}
                colorScheme={textFieldColorScheme}
                error={hasError}
                endAdornment={endAdornment}
                inputProps={{ ...field, ...meta }}
            />
            <ErrorLabel touched={meta.touched} errorMessage={meta.error} />
        </FormGroup>
    )
}

export default Input
