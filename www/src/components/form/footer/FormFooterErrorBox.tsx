import { createStyles, Theme, Typography, TypographyProps } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { breakpoints } from '../../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: '#FF00002C',
            color: theme.palette.error.main,
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            borderRadius: '8px',
            padding: '.5em 2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
                padding: '.35em 2em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '.6em 2em',
            },
        },
    }),
)

interface OwnProps {
    error: string
}

export type FormFooterErrorBoxProps = OwnProps & TypographyProps

const FormFooterErrorBox = ({ error, className, ...props }: FormFooterErrorBoxProps) => {
    const classes = useStyles()

    return (
        <Typography {...props} className={`${classes.root} ${className}`}>
            {error}
        </Typography>
    )
}

export default FormFooterErrorBox
