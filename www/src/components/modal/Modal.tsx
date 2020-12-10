import {Modal as MaterialModal, ModalProps as MaterialModalProps, createStyles, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        position: 'absolute',
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        width: 675,
        backgroundColor: theme.palette.background.default,
        border: '1px solid',
        borderColor: theme.palette.grey[600],
        boxShadow: theme.shadows[5],
        padding: 42,
        borderRadius: '6px',
        outline: 'none',
        alignItems: 'center',
    },
}))

export const Modal: React.FC<MaterialModalProps> = ({children, ...props}) => {
    const classes = useStyles()
    return <MaterialModal
        {...props}>
        <div className={classes.root}>
            {children}
        </div>
    </MaterialModal>
}
