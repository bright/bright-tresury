import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import React from "react";
import {Link as ReactRouterLink} from "react-router-dom";
import {Link as MaterialLink} from "@material-ui/core";
import {Strong} from "../info/Info";

const useStyles = makeStyles(() =>
    createStyles({
        link: {
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            }
        },
    }),
);

export interface RouterLinkProps {
    to: string
}

export const RouterLink: React.FC<RouterLinkProps> = ({to, children}) => {
    const classes = useStyles()
    return <MaterialLink component={ReactRouterLink} to={to} className={classes.link}>
        <Strong>
            {children}
        </Strong>
    </MaterialLink>
}
