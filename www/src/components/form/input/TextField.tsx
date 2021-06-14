import {
    InputAdornment,
    TextField as MaterialTextField,
    TextFieldProps as MaterialTextFieldProps,
} from '@material-ui/core'
import React from 'react'
import { TextFieldColorScheme, useTextFieldStyles } from './textFieldStyles'

interface OwnProps {
    endAdornment?: string
    colorScheme?: TextFieldColorScheme
}

export type TextFieldProps = OwnProps & MaterialTextFieldProps

const TextField = ({ endAdornment, colorScheme = TextFieldColorScheme.Light, ...props }: TextFieldProps) => {
    const classes = useTextFieldStyles({ colorScheme })()

    return (
        <MaterialTextField
            {...props}
            variant="filled"
            InputProps={{
                classes: { ...classes },
                disableUnderline: true,
                endAdornment: endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : null,
            }}
        />
    )
}

export default TextField
