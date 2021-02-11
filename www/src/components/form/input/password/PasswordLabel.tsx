import {createStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import {IconButton} from "../../../button/IconButton";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        icon: {
            padding: 0,
            height: '12px',
        }
    }),
);

interface PasswordLabelProps {
    label?: string
    icon: string
    onClick: () => void
}

export const PasswordLabel: React.FC<PasswordLabelProps> = ({label, icon, onClick}) => {
    const classes = useStyles()
    return <div className={classes.root}>
        {label && <div>{label}</div>}
        <IconButton className={classes.icon} svg={icon} onClick={onClick}/>
    </div>
}
