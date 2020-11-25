import React from "react";
import {createStyles, InputAdornment, InputLabel, TextField, TextFieldProps} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import {useField} from "formik";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: '#fff',
            padding: '0'
        },
        label: {
            marginBottom: '1em',
            color: '#1B1D1C',
            fontSize: '0.75em',
        },
        input: {
            fontSize: '0.875em',
            backgroundColor: '#fff',
            padding: '1em',
            fontWeight: 500
        },
        adornedEnd: {
            paddingRight: '1.5em'
        }
    }),
);

interface InputProps {
    label?: string
    endAdornment?: string
}

export const Input: React.FC<InputProps & TextFieldProps> = ({label, endAdornment, ...props}) => {
    const classes = useStyles()
    // @ts-ignore
    const [field, meta] = useField({...props});
    return <FormGroup>
        {label ? <InputLabel className={classes.label}>{label}</InputLabel> : null}
        <TextField
            {...props}
            inputProps={{...field, ...meta}}
            variant="filled"
            InputProps={{
                disableUnderline: true,
                classes: {
                    focused: classes.root,
                    root: classes.root,
                    input: classes.input,
                    adornedEnd: classes.adornedEnd
                },
                endAdornment: endAdornment ?
                    <InputAdornment position="end">{endAdornment}</InputAdornment> : null
            }}>
        </TextField>
    </FormGroup>
}
