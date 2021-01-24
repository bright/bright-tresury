import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import React from "react";
import {Link} from "react-router-dom";
import {Strong} from "../info/Info";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        link: {
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            }
        },
    }),
);

interface Props {
    to: string
}

export const RouterLink: React.FC<Props> = ({to, children}) => {
    const classes = useStyles()
    return <Link to={to} className={classes.link}>
        <Strong>
            {children}
        </Strong>
    </Link>
}
