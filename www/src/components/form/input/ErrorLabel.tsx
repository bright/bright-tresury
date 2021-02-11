import {createStyles, InputLabel, InputLabelProps, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React, {useMemo} from "react";

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

    /*
     * Formik does not support multiple errors
     * Custom validate function returns an array of errors which needs to be handled manually
     */
    const error = useMemo(() => {
        if (!Array.isArray(errorMessage)) {
            return errorMessage
        }
        else if (errorMessage.length > 0){
            return errorMessage[0]
        }
        return undefined
    }, [errorMessage])

    return touched && error ?
        <InputLabel className={`${classes.errorLabel} ${className}`}>{error}</InputLabel>
        : null
}
