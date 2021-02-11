import {createStyles, InputLabel, InputLabelProps, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React, {useMemo} from "react";
import {formikErrorToString} from "../../../util/form.util";

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
    errorMessage?: string | string[]
}

export type ErrorLabelProps = OwnProps & InputLabelProps

export const ErrorLabel: React.FC<ErrorLabelProps> = ({touched, errorMessage, className, ...props}) => {
    const classes = useStyles()

    const error = formikErrorToString(errorMessage)

    return touched && error ?
        <InputLabel
            {...props}
            className={`${classes.errorLabel} ${className}`}>
            {error}
        </InputLabel>
        : null
}
