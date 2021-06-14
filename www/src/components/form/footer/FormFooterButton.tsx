import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { PropsWithChildren } from 'react'
import { breakpoints } from '../../../theme/theme'
import Button, { ButtonProps } from '../../button/Button'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%',
            },
        },
    }),
)
export type FormFooterButtonProps = PropsWithChildren<ButtonProps>

const FormFooterButton = ({ children, ...props }: FormFooterButtonProps) => {
    const classes = useStyles()
    return (
        <Button className={classes.root} color="primary" {...props}>
            {children}
        </Button>
    )
}

export default FormFooterButton
