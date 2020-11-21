import React, {PropsWithChildren} from "react";
import {createStyles, InputAdornment, InputLabel, TextField} from "@material-ui/core";
import {makeStyles, styled, Theme} from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import {TextFieldProps} from "@material-ui/core/TextField/TextField";

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

interface TextInputProps {
    label: string
    placeholder?: string
    multiline?: boolean
    rows?: number
    endAdornment?: string
}

export const TextInput: React.FC<TextInputProps & React.PropsWithChildren<any>> = ({...props}) => {
    const classes = useStyles()
    return <FormGroup {...props}>
        {props.label ? <InputLabel className={classes.label}>{props.label}</InputLabel> : null}
        <TextField
            variant="filled"
            InputProps={{
                disableUnderline: true,
                classes: {
                    focused: classes.root,
                    root: classes.root,
                    input: classes.input,
                    adornedEnd: classes.adornedEnd
                },
                endAdornment: props.endAdornment ?
                    <InputAdornment position="end">{props.endAdornment}</InputAdornment> : null
            }}
            multiline={props.multiline === true}
            rows={props.rows ? props.rows : 1}
            placeholder={props.placeholder ? props.placeholder : null}>
        </TextField>
    </FormGroup>
}

export const Input = styled(TextInput)({})
