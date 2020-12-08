import React from "react";
import {
    createStyles,
    InputAdornment,
    InputLabel,
    TextField,
    TextFieldProps
} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import {useField} from "formik";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.default,
            padding: '0'
        },
        label: {
            marginBottom: '8px',
            color: theme.palette.text.primary,
            fontSize: '0.75em',
        },
        input: {
            backgroundColor: theme.palette.background.default,
            border: `solid 1px ${theme.palette.background.default}`,
            fontSize: '0.875em',
            padding: '1em',
            fontWeight: 500
        },
        adornedEnd: {
            paddingRight: '1.5em'
        },
        error: {
            '& input': {
                borderColor: theme.palette.error.main
            },
        },
        errorLabel: {
            color: theme.palette.error.main,
            fontSize: '11px',
            marginTop: '5px'
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
    const hasError: boolean = meta.touched && Boolean(meta.error)
    return <FormGroup>
        {label ? <InputLabel className={classes.label}>{label}</InputLabel> : null}
        <TextField
            {...props}
            error={hasError}
            classes={classes}
            inputProps={{...field, ...meta}}
            variant="filled"
            InputProps={{
                classes: {...classes},
                disableUnderline: true,
                endAdornment: endAdornment ?
                    <InputAdornment position="end">{endAdornment}</InputAdornment> : null
            }}>
        </TextField>
        {hasError ? (
            <InputLabel className={classes.errorLabel}>{meta.error}</InputLabel>
        ) : null}
    </FormGroup>
}
