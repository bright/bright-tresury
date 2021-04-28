import React, {PropsWithChildren} from "react";
import {Paper, PaperProps} from "@material-ui/core";
import {useCardStyles} from "./cardStyles";
import {Link} from 'react-router-dom'

interface OwnProps {
    redirectTo: string
}

export const LinkCard = ({ redirectTo, children, ...props }: PropsWithChildren<OwnProps & PaperProps>) => {

    const classes = useCardStyles()

    return (
        <Paper {...props} className={classes.root}>
            <Link to={redirectTo} className={classes.link}>
                {children}
            </Link>
        </Paper>
    )
}
