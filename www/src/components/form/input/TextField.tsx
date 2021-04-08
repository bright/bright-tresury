import React from "react";
import {useTextFieldStyles} from "./textFieldStyles";
import {InputAdornment, TextField as MaterialTextField, TextFieldProps as MaterialTextFieldProps} from "@material-ui/core";
import {TextFieldColorScheme} from "./textFieldStyles";

interface OwnProps {
    endAdornment?: string
    textFieldColorScheme?: TextFieldColorScheme
}

export type TextFieldProps = OwnProps & MaterialTextFieldProps

export const TextField: React.FC<TextFieldProps> = ({endAdornment, textFieldColorScheme = TextFieldColorScheme.Light, ...props}) => {

    const classes = useTextFieldStyles({ colorScheme: textFieldColorScheme })

    return <MaterialTextField
        {...props}
        variant="filled"
        InputProps={{
            classes: {...classes},
            disableUnderline: true,
            endAdornment: endAdornment ?
                <InputAdornment position="end">{endAdornment}</InputAdornment> : null
        }}/>
}
