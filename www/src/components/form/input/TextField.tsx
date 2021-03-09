import {createStyles, InputAdornment, TextField as MaterialTextField, TextFieldProps as MaterialTextFieldProps} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.default,
            padding: '0'
        },
        input: {
            backgroundColor: theme.palette.background.default,
            border: `solid 1px ${theme.palette.background.default}`,
            fontSize: '14px',
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
    }),
);

interface OwnProps {
    endAdornment?: string
}

export type TextFieldProps = OwnProps & MaterialTextFieldProps

export const TextField: React.FC<TextFieldProps> = ({endAdornment, ...props}) => {
    const classes = useStyles()

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
