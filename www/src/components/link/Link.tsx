import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles, Link as MaterialLink} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        link: {
            fontSize: '14px',
            fontWeight: 600,
            color: theme.palette.text.primary,
        },
    }),
);

interface Props {
    href: string
    text?: string
}

export const Link: React.FC<Props> = ({href, text}) => {
    const classes = useStyles()
    return <MaterialLink href={href} className={classes.link}>{text ?? href}</MaterialLink>
}
