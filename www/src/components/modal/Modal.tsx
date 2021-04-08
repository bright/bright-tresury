import {createStyles, DialogProps as MaterialModalProps, Theme} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import {breakpoints} from "../../theme/theme";

const useStyles = makeStyles((theme: Theme) => createStyles({
    inner: {
        padding: '2.5em 1.5em',
        backgroundColor: theme.palette.background.default,
        outline: 'none',
        alignItems: 'center',
        [theme.breakpoints.up(breakpoints.tablet)]: {
            width: 500,
        },
        [theme.breakpoints.up(breakpoints.desktop)]: {
            width: 800,
        },
    },
    root: {
        border: '1px solid',
        borderColor: theme.palette.grey[600],
        boxShadow: theme.shadows[5],
        borderRadius: '6px',
    }
}))

export type Props = MaterialModalProps

export const Modal: React.FC<Props> = ({children, ...props}) => {
    const classes = useStyles()
    return (
        <Dialog
            className={classes.root}
            {...props}
        >
            <div className={classes.inner}>
                {children}
            </div>
        </Dialog>
    )
}
