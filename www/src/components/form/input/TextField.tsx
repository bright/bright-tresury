import {InputAdornment, TextField as MaterialTextField, TextFieldProps as MaterialTextFieldProps} from "@material-ui/core";
import React from "react";
import {TextFieldColorScheme, useTextFieldStyles} from "./textFieldStyles";

interface OwnProps {
    endAdornment?: string
    colorScheme?: TextFieldColorScheme
}

export type TextFieldProps = OwnProps & MaterialTextFieldProps

export const TextField: React.FC<TextFieldProps> = ({endAdornment, colorScheme = TextFieldColorScheme.Light, ...props}) => {

    const classes = useTextFieldStyles({colorScheme})()

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
