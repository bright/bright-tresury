import React, {PropsWithChildren} from "react";
import {Paper, PaperProps} from "@material-ui/core";
import {useCardStyles} from "./cardStyles";

export const Card = ({ children, ...props }: PropsWithChildren<PaperProps>) => {

    const classes = useCardStyles()

    return (
        <Paper {...props} className={classes.root}>
            {children}
        </Paper>
    )
}
