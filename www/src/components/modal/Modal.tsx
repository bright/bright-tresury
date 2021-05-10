import {createStyles, DialogProps as MaterialDialogProps, Theme} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        border: '1px solid',
        borderColor: theme.palette.grey[600],
        boxShadow: theme.shadows[5],
        borderRadius: '6px',
    },
    inner: {
        padding: '2.5em 1.5em',
        backgroundColor: theme.palette.background.default,
        outline: 'none',
        alignItems: 'center'
    }
}))

export type Props = MaterialDialogProps

export const Modal = ({ children, ...props }: Props) => {

    const classes = useStyles()

    return (
        <Dialog className={classes.root} {...props}>
            <div className={classes.inner}>
                {children}
            </div>
        </Dialog>
    )
}
