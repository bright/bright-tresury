import { Button as MaterialButton, ButtonProps as MaterialButtonProps, createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            padding: '.5em 2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '.35em 2em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '.6em 2em',
            },
        },
        text: {
            paddingLeft: 0,
            paddingRight: 0,
        },
        containedSecondary: {
            color: theme.palette.text.secondary,
            fontWeight: 'bold',
            boxShadow: 'initial',
        },
    }),
)

interface OwnProps {
    variant?: ButtonVariant
}
export type ButtonProps = OwnProps & MaterialButtonProps

export const Button: React.FC<ButtonProps> = ({ children, variant, ...props }) => {
    const classes = useStyles()
    return (
        <MaterialButton {...props} classes={classes} variant={variant ?? 'contained'}>
            {children}
        </MaterialButton>
    )
}

export type ButtonVariant = 'contained' | 'outlined' | 'text'
