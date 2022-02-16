import { createStyles, DialogProps as MaterialDialogProps, Theme } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            border: '1px solid',
            borderColor: theme.palette.grey[600],
            boxShadow: theme.shadows[5],
            borderRadius: '6px',
        },
    }),
)

const usePaperStyles = makeStyles((theme) =>
    createStyles({
        paper: {
            padding: '2.5em 1.5em',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '1.5em 1em',
            },
            backgroundColor: theme.palette.background.default,
            outline: 'none',
        },
    }),
)
interface OwnProps {}
export type ModalProps = OwnProps & MaterialDialogProps

const Modal = ({ children, className, ...props }: ModalProps) => {
    const classes = useStyles()
    const paperClasses = usePaperStyles()

    return (
        <Dialog className={clsx(classes.root, className)} classes={paperClasses} {...props}>
            {children}
        </Dialog>
    )
}
export default Modal
