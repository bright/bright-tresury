import FormGroup from '@material-ui/core/FormGroup'
import { FieldHookConfig, useField } from 'formik'
import React, { useMemo } from 'react'
import { Nil } from '../../../util/types'
import { Label } from '../../text/Label'
import ErrorLabel from './ErrorLabel'
import TextField, { TextFieldProps } from './TextField'
import { TextFieldColorScheme } from './textFieldStyles'
import MDEditor from '@uiw/react-md-editor'
import { isWidthDown } from '@material-ui/core/withWidth'
import { breakpoints } from '../../../theme/theme'
import { WithWidthProps } from '@material-ui/core/withWidth/withWidth'
import { withWidth } from '@material-ui/core'

interface OwnProps {
    label?: string | JSX.Element
    description?: Nil<string>
    endAdornment?: string
    textFieldColorScheme?: TextFieldColorScheme
    markdown?: boolean
}

export type InputProps = OwnProps & Omit<TextFieldProps, 'label'> & FieldHookConfig<string> & WithWidthProps

const Input = ({
    label,
    description,
    endAdornment,
    name = '',
    textFieldColorScheme = TextFieldColorScheme.Light,
    className,
    markdown,
    width,
    ...props
}: InputProps) => {
    const [field, meta] = useField(name)
    const hasError: boolean = meta.touched && Boolean(meta.error)
    const isMobile = useMemo(() => isWidthDown(breakpoints.mobile, width!), [width])

    return (
        <FormGroup className={className}>
            {label ? <Label label={label} description={description} /> : null}
            {markdown ? (
                <MDEditor
                    commandsFilter={(cmd) => {
                        if (cmd.name && cmd.name.includes('image')) {
                            return false
                        }
                        return cmd
                    }}
                    preview={isMobile ? 'edit' : 'live'}
                    value={field.value}
                    textareaProps={{ ...field, ...meta }}
                    height={300}
                />
            ) : (
                <TextField
                    {...props}
                    colorScheme={textFieldColorScheme}
                    error={hasError}
                    endAdornment={endAdornment}
                    inputProps={{ ...field, ...meta }}
                />
            )}
            <ErrorLabel touched={meta.touched} errorMessage={meta.error} />
        </FormGroup>
    )
}

export default withWidth()(Input)
