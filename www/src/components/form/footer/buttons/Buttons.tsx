import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { breakpoints } from '../../../../theme/theme'
import { Button, ButtonProps } from '../../../button/Button'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%',
            },
        },
    }),
)

export const FormButton = ({ children, ...props }: ButtonProps) => {
    const classes = useStyles()
    return (
        <Button className={classes.button} color="primary" {...props}>
            {children}
        </Button>
    )
}

export const LeftButton = ({ children, ...props }: ButtonProps) => {
    const classes = useStyles()
    return (
        <Button className={classes.button} variant={'outlined'} color="primary" type="submit" {...props}>
            {children}
        </Button>
    )
}

export const RightButton = ({ children, ...props }: ButtonProps) => {
    const classes = useStyles()
    return (
        <Button className={classes.button} variant={'contained'} color="primary" type="submit" {...props}>
            {children}
        </Button>
    )
}
