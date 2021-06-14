import { createStyles, Theme, Typography, TypographyProps } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { formikErrorToString } from '../../../util/form.util'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        errorLabel: {
            color: theme.palette.error.main,
            fontSize: '11px',
            marginTop: '5px',
        },
    }),
)

interface OwnProps {
    touched: boolean
    errorMessage?: string | string[]
}

export type ErrorLabelProps = OwnProps & TypographyProps

const ErrorLabel = ({ touched, errorMessage, className, ...props }: ErrorLabelProps) => {
    const classes = useStyles()

    const error = formikErrorToString(errorMessage)

    return touched && error ? (
        <Typography {...props} className={`${classes.errorLabel} ${className}`}>
            {error}
        </Typography>
    ) : null
}
export default ErrorLabel
