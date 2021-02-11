import {TextFieldProps} from "@material-ui/core";
import FormGroup from "@material-ui/core/FormGroup";
import {useField} from "formik";
import React from "react";
import {Label} from "../../text/Label";
import {ErrorLabel} from "./ErrorLabel";
import {TextField} from "./TextField";

interface OwnProps {
    label?: string | JSX.Element
    endAdornment?: string
}

export type InputProps = OwnProps & Omit<TextFieldProps, "label">

export const Input: React.FC<InputProps> = ({label, endAdornment, name = '', ...props}) => {

    const [field, meta] = useField(name);
    const hasError: boolean = meta.touched && Boolean(meta.error)

    return <FormGroup>
        {label ? <Label label={label}/> : null}
        <TextField
            {...props}
            error={hasError}
            endAdornment={endAdornment}
            inputProps={{...field, ...meta}}
        />
        <ErrorLabel touched={meta.touched} errorMessage={meta.error}/>
    </FormGroup>
}
