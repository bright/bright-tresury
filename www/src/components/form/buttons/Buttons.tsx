import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { breakpoints } from '../../../theme/theme'
import { Button, ButtonProps } from '../../button/Button'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        leftButtonWrapper: {
            display: 'flex',
            justifyContent: 'flex-start',
        },
        rightButtonWrapper: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        button: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%',
            },
        },
    }),
)

export const LeftButton = ({ children, ...props }: ButtonProps) => {
    const classes = useStyles()
    return (
        <div className={classes.leftButtonWrapper}>
            <Button className={classes.button} variant={'outlined'} color="primary" type="submit" {...props}>
                {children}
            </Button>
        </div>
    )
}

export const RightButton = ({ children, ...props }: ButtonProps) => {
    const classes = useStyles()
    return (
        <div className={classes.rightButtonWrapper}>
            <Button className={classes.button} variant={'contained'} color="primary" type="submit" {...props}>
                {children}
            </Button>
        </div>
    )
}
