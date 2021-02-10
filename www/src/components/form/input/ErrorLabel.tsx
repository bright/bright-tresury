import {createStyles, InputLabel, InputLabelProps, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        errorLabel: {
            color: theme.palette.error.main,
            fontSize: '11px',
            marginTop: '5px'
        }
    }),
);

interface OwnProps {
    touched: boolean
    errorMessage?: string
}

export type ErrorLabelProps = OwnProps & InputLabelProps

export const ErrorLabel: React.FC<ErrorLabelProps> = ({touched, errorMessage, className, ...props}) => {
    const classes = useStyles()
    return touched && errorMessage ?
        <InputLabel className={`${classes.errorLabel} ${className}`}>{errorMessage}</InputLabel>
        : null
}
