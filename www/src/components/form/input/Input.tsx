import { withWidth } from '@material-ui/core'
import FormGroup from '@material-ui/core/FormGroup'
import { isWidthDown } from '@material-ui/core/withWidth'
import { WithWidthProps } from '@material-ui/core/withWidth/withWidth'
import MDEditor from '@uiw/react-md-editor'
import { FieldHookConfig, useField } from 'formik'
import React, { useMemo } from 'react'
import { breakpoints } from '../../../theme/theme'
import { Nil } from '../../../util/types'
import { Label } from '../../text/Label'
import ErrorLabel from './ErrorLabel'
import TextField, { TextFieldProps } from './TextField'
import { TextFieldColorScheme } from './textFieldStyles'
import Web3AddressInput from './web3Address/Web3AddressInput'

export type InputVariant = 'text' | 'markdown' | 'web3Address'

interface OwnProps {
    label?: string | JSX.Element
    description?: Nil<string>
    endAdornment?: string
    textFieldColorScheme?: TextFieldColorScheme
    variant?: InputVariant
}

export type InputProps = OwnProps & Omit<TextFieldProps, 'label' | 'variant'> & FieldHookConfig<string> & WithWidthProps

const Input = ({
    label,
    description,
    endAdornment,
    name = '',
    textFieldColorScheme = TextFieldColorScheme.Light,
    className,
    variant = 'text',
    width,
    ...props
}: InputProps) => {
    const [field, meta] = useField(name)
    const hasError: boolean = meta.touched && Boolean(meta.error)
    const isMobile = useMemo(() => isWidthDown(breakpoints.mobile, width!), [width])

    const renderInput = () => {
        switch (variant) {
            case 'text':
                return (
                    <TextField
                        {...props}
                        colorScheme={textFieldColorScheme}
                        error={hasError}
                        endAdornment={endAdornment}
                        inputProps={{ ...field, ...meta }}
                    />
                )
            case 'markdown':
                return (
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
                )
            case 'web3Address':
                return (
                    <Web3AddressInput
                        {...props}
                        colorScheme={textFieldColorScheme}
                        error={hasError}
                        inputProps={{ ...field, ...meta }}
                    />
                )
        }
    }

    return (
        <FormGroup className={className}>
            {label ? <Label label={label} description={description} /> : null}
            {renderInput()}
            <ErrorLabel touched={meta.touched} errorMessage={meta.error} />
        </FormGroup>
    )
}

export default withWidth()(Input)
