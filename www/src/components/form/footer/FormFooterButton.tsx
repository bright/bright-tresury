import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { breakpoints } from '../../../theme/theme'
import { Button, ButtonProps } from '../../button/Button'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%',
            },
        },
    }),
)

export const FormFooterButton = ({ children, ...props }: ButtonProps) => {
    const classes = useStyles()
    return (
        <Button className={classes.root} color="primary" {...props}>
            {children}
        </Button>
    )
}
