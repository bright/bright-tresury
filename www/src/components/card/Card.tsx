import React from "react";
import {Paper, PaperProps, createStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => createStyles({
    root: {
        borderRadius: '8px'
    }
}))

export const Card: React.FC<PaperProps> = ({children, ...props}) => {
    const classes = useStyles()
    return <Paper {...props} classes={classes}>
        {children}
    </Paper>
}
